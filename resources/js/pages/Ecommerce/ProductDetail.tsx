import ProductCard from '@/components/ecommerce/ProductCard'
import EcommerceLayout from '@/layouts/ecom-layout'
import { Link, router, useForm, usePage } from '@inertiajs/react'
import {
  Facebook,
  Heart,
  Instagram,
  Lock,
  Minus,
  Plus,
  RefreshCw,
  Shield,
  ShoppingCart,
  Star,
  StarHalf,
  Twitter,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface VariationOption {
  id: number
  name: string
  images: string[]
}

interface VariationType {
  id: number
  name: string
  type: string
  options: VariationOption[]
}

interface Variation {
  id: number
  variation_type_option_ids: number[] | string // Can be array or JSON string
  quantity: number
  price: string
}

interface ProductDetailProps {
  product: {
    id: number
    name: string
    slug: string
    description?: string
    price: string
    quantity: number | null
    image: string
    images: string[]
    variationTypes: VariationType[]
    variations: Variation[]
    rating: number
    reviews_count: number
  }
  variationOptions: Record<string, number>
  relatedProducts: any[]
}

// Helper function to compare arrays
const arraysAreEqual = (arr1: number[], arr2: number[]): boolean => {
  if (arr1.length !== arr2.length) return false
  return arr1.every((val, index) => val === arr2[index])
}

// Update the getSafeImageUrl function to handle different types of image inputs
const getSafeImageUrl = (imageUrl: any, fallback: string = '/placeholder-image.jpg'): string => {
  if (!imageUrl) {
    return fallback
  }

  // If it's a string, check if it's empty
  if (typeof imageUrl === 'string') {
    return imageUrl.trim() === '' ? fallback : imageUrl
  }

  // If it's an object with large/thumb properties
  if (typeof imageUrl === 'object') {
    if (imageUrl.large) {
      return typeof imageUrl.large === 'string' ? imageUrl.large : fallback
    }
    if (imageUrl.thumb) {
      return typeof imageUrl.thumb === 'string' ? imageUrl.thumb : fallback
    }
  }

  return fallback
}

const ProductDetail = ({ product, variationOptions, relatedProducts }: ProductDetailProps) => {
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [selectedOptions, setSelectedOptions] = useState<Record<number, VariationOption>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  const { url } = usePage()

  const form = useForm<{
    option_ids: Record<string, number>
    quantity: number
    price: number | null
  }>({
    option_ids: {},
    quantity: 1,
    price: null,
  })

  // Helper function to get option IDs map
  const getOptionIdsMap = (options: Record<number, VariationOption>) => {
    const validOptions = Object.entries(options)
      .filter(([_, option]) => option && option.id)
      .map(([typeId, option]) => [typeId, option.id])

    if (validOptions.length === 0) {
      return {}
    }

    return Object.fromEntries(validOptions)
  }

  // Update the images useMemo to handle the image objects properly
  const images = useMemo(() => {
    let imagesList: any[] = []

    if (selectedOptions && Object.keys(selectedOptions).length > 0) {
      for (let typeId in selectedOptions) {
        const option = selectedOptions[typeId]
        if (option?.images && option.images.length > 0) {
          // Filter out invalid images
          imagesList = option.images.filter(
            (img) => img && (typeof img === 'string' || typeof img === 'object')
          )
          if (imagesList.length > 0) {
            break
          }
        }
      }
    }

    // If no images from selected options, use product images
    if (imagesList.length === 0) {
      imagesList =
        product.images?.filter(
          (img) => img && (typeof img === 'string' || typeof img === 'object')
        ) || []
    }

    // If still no images, use the main product image
    if (imagesList.length === 0 && product.image) {
      imagesList = [product.image]
    }

    // If still no images, use placeholder
    if (imagesList.length === 0) {
      imagesList = ['/placeholder-image.jpg']
    }

    return imagesList
  }, [product, selectedOptions])

  // Computed product details based on selected variation
  const computedProduct = useMemo(() => {
    if (!product.variations?.length || !Object.keys(selectedOptions).length) {
      return {
        price: product.price,
        quantity: product.quantity,
        variation: null,
      }
    }

    const selectedOptionIds = Object.values(selectedOptions)
      .filter((op) => op && op.id)
      .map((op) => op.id)
      .sort((a, b) => a - b)

    const matchingVariation = product.variations.find((variation) => {
      if (!variation.variation_type_option_ids) return false

      let variationIds: number[]
      try {
        if (Array.isArray(variation.variation_type_option_ids)) {
          variationIds = variation.variation_type_option_ids.sort((a, b) => a - b)
        } else {
          variationIds = JSON.parse(variation.variation_type_option_ids as string).sort(
            (a: number, b: number) => a - b
          )
        }
      } catch (e) {
        console.error('Error parsing variation IDs:', e)
        return false
      }

      return arraysAreEqual(selectedOptionIds, variationIds)
    })

    return {
      price: matchingVariation?.price || product.price,
      quantity:
        matchingVariation?.quantity === null
          ? Number.MAX_VALUE
          : matchingVariation?.quantity || product.quantity,
      variation: matchingVariation,
    }
  }, [product, selectedOptions])

  // Initialize selected options from URL parameters or defaults
  useEffect(() => {
    if (product.variationTypes?.length > 0 && !isInitialized) {
      const initialOptions: Record<number, VariationOption> = {}

      product.variationTypes.forEach((type) => {
        if (type.options?.length > 0) {
          // Check if we have URL parameters for this type

          const selectedOptionId = variationOptions?.[type.id.toString()]

          if (selectedOptionId) {
            // If we have a URL parameter, find and use that option
            const selectedOption = type.options.find((op) => op.id === Number(selectedOptionId))
            if (selectedOption) {
              initialOptions[type.id] = selectedOption
            } else {
              // If URL option not found, use first option
              initialOptions[type.id] = type.options[0]
            }
          } else {
            // If no URL parameter, use the first option as default
            initialOptions[type.id] = type.options[0]
          }
        }
      })
      setSelectedOptions(initialOptions)
      setIsInitialized(true)
    }
  }, [product.variationTypes, variationOptions, isInitialized])

  // Update form data when computed product changes
  useEffect(() => {
    if (Object.keys(selectedOptions).length > 0 && isInitialized) {
      form.setData({
        option_ids: getOptionIdsMap(selectedOptions),
        quantity: quantity,
        price: parseFloat(computedProduct.price.toString()),
      })
    }
  }, [selectedOptions, quantity, computedProduct.price, isInitialized])

  const discount = 0

  // Handle option selection and URL update
  const handleOptionSelect = (typeId: number, option: VariationOption) => {
    if (!option || !typeId) return

    const newOptions = {
      ...selectedOptions,
      [typeId]: option,
    }

    setSelectedOptions(newOptions)

    // Update URL with new options
    const optionIds = getOptionIdsMap(newOptions)
    if (Object.keys(optionIds).length > 0) {
      const searchParams = new URLSearchParams()
      Object.entries(optionIds).forEach(([typeId, optionId]) => {
        searchParams.append(`options[${typeId}]`, optionId.toString())
      })

      const newUrl = `${url.split('?')[0]}?${searchParams.toString()}`

      // Only update URL if it's different from current URL
      if (window.location.href !== window.location.origin + newUrl) {
        router.get(
          newUrl,
          {},
          {
            preserveScroll: true,
            preserveState: true,
            replace: true, // Use replace to avoid creating too many history entries
          }
        )
      }
    }
  }

  const addToCart = () => {
    form.post(route('cart.store', product.id), {
      preserveScroll: true,
      preserveState: true,
      onError: (err: any) => {
        console.log(err)
      },
      onSuccess: () => {
        // You can add a success notification here
        console.log('Product added to cart successfully')
      },
    })
  }

  return (
    <EcommerceLayout>
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-indigo-600">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="flex flex-col lg:flex-row">
            {/* Product Images */}
            <div className="w-full p-6 lg:w-2/5">
              <div className="relative mb-4">
                {discount > 0 && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="rounded bg-red-500 px-2 py-1 text-xs text-white">
                      -{discount}%
                    </span>
                  </div>
                )}
                <img
                  src={getSafeImageUrl(images[activeImage]?.large || images[activeImage])}
                  alt={product.name}
                  className="h-96 w-full rounded-lg object-contain"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-md border-2 ${
                      activeImage === index ? 'border-indigo-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={getSafeImageUrl(image?.thumb || image)}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full border-l p-6 lg:w-3/5">
              {/* Basic Info */}
              <div className="mb-6">
                <h1 className="mb-2 text-2xl font-bold text-gray-800">{product.name}</h1>

                {/* Rating */}
                <div className="mb-4 flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, index) => {
                      const rating = product.rating
                      if (index + 1 <= Math.floor(rating)) {
                        return <Star key={index} className="fill-current" size={16} />
                      } else if (index < rating) {
                        return <StarHalf key={index} className="fill-current" size={16} />
                      }
                      return <Star key={index} size={16} />
                    })}
                  </div>
                  <span className="ml-2 text-gray-600">
                    ({product.rating} - {product.reviews_count} Reviews)
                  </span>
                </div>

                {/* Price and Stock Status */}
                <div className="mb-4 flex items-center">
                  <span className="text-3xl font-bold text-indigo-600">
                    ${computedProduct.price}
                  </span>
                  {computedProduct.variation && (
                    <span className="ml-2 text-sm text-gray-500">(Selected variation)</span>
                  )}
                </div>

                <div className="mb-4 flex items-center text-sm text-gray-500">
                  <span className="mr-4 flex items-center">
                    <Shield className="mr-1 text-green-500" size={16} />
                    {computedProduct.quantity && computedProduct.quantity !== Number.MAX_VALUE
                      ? `In Stock (${computedProduct.quantity} available)`
                      : computedProduct.quantity === Number.MAX_VALUE
                        ? 'In Stock'
                        : 'Out of Stock'}
                  </span>
                  <span className="flex items-center">
                    <RefreshCw className="mr-1 text-blue-500" size={16} />
                    Free Shipping
                  </span>
                </div>

                <p className="mb-4 text-gray-600">{product.description}</p>
              </div>

              {/* Variation Options */}
              {product.variationTypes?.map((type) => (
                <div key={type.id} className="mb-6">
                  <h3 className="mb-2 font-semibold text-gray-800">{type.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {type.options?.map((option) => {
                      const isSelected = selectedOptions[type.id]?.id === option.id
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(type.id, option)}
                          className={`rounded-md border px-4 py-2 transition-colors ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                              : 'border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {option.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="mb-2 font-semibold text-gray-800">Quantity</h3>
                <div className="flex w-32 items-center rounded-md border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-gray-600 hover:text-indigo-600"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 border-none text-center focus:ring-0"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 text-gray-600 hover:text-indigo-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <button
                  onClick={addToCart}
                  disabled={
                    !computedProduct.quantity || computedProduct.quantity === 0 || form.processing
                  }
                  className="flex flex-1 items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  <ShoppingCart className="mr-2" size={20} /> Add to Cart
                </button>
                <button
                  disabled={!computedProduct.quantity || computedProduct.quantity === 0}
                  className="flex flex-1 items-center justify-center rounded-md bg-gray-800 px-6 py-3 text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  <Zap className="mr-2" size={20} /> Buy Now
                </button>
                <button className="rounded-md border border-gray-300 p-3 text-gray-600 hover:bg-gray-100">
                  <Heart size={20} />
                </button>
                <button className="rounded-md border border-gray-300 p-3 text-gray-600 hover:bg-gray-100">
                  <RefreshCw size={20} />
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-4">
                <div className="flex flex-col text-sm text-gray-600 sm:flex-row sm:items-center">
                  <div className="mb-2 flex items-center sm:mr-6 sm:mb-0">
                    <Shield className="mr-2 text-indigo-500" size={16} />
                    <span>1 Year Warranty</span>
                  </div>
                  <div className="mb-2 flex items-center sm:mr-6 sm:mb-0">
                    <RefreshCw className="mr-2 text-indigo-500" size={16} />
                    <span>30-Day Return Policy</span>
                  </div>
                  <div className="flex items-center">
                    <Lock className="mr-2 text-indigo-500" size={16} />
                    <span>Secure Checkout</span>
                  </div>
                </div>

                {/* Share Links */}
                <div className="mt-4 flex items-center">
                  <span className="mr-2 text-gray-600">Share:</span>
                  <div className="flex space-x-2">
                    <a href="#" className="text-gray-500 hover:text-blue-600">
                      <Facebook size={16} />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-400">
                      <Twitter size={16} />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-pink-600">
                      <Instagram size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-8">
          <div className="border-b">
            <div className="-mb-px flex flex-wrap">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                  activeTab === 'description'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                  activeTab === 'specs'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews ({product.reviews_count})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-4 rounded-b-lg bg-white p-6 shadow-sm">
            {activeTab === 'description' && (
              <div>
                <h3 className="mb-3 text-lg font-semibold">Product Description</h3>
                <p className="mb-4 text-gray-600">
                  {product.description ||
                    'Experience music like never before with our premium Wireless Noise Cancelling Headphones. Designed for the ultimate listening experience, these headphones combine cutting-edge technology with superior comfort.'}
                </p>
                <p className="mb-4 text-gray-600">
                  The active noise cancellation technology blocks out ambient sounds, allowing you
                  to focus on your music, podcast, or call without distractions. With crystal-clear
                  sound quality and deep, rich bass, these headphones deliver an immersive audio
                  experience that brings your music to life.
                </p>

                <h4 className="mt-4 mb-2 font-semibold">Key Features:</h4>
                <ul className="mb-4 list-inside list-disc space-y-1 text-gray-600">
                  <li>Active Noise Cancellation Technology</li>
                  <li>Bluetooth 5.0 with 10m range</li>
                  <li>Up to 30 hours battery life</li>
                  <li>Fast charging (10 min charge = 3 hours playback)</li>
                  <li>Premium memory foam ear cushions</li>
                  <li>Built-in microphone for calls</li>
                  <li>Voice assistant compatible (Siri, Google Assistant)</li>
                </ul>

                <h4 className="mt-4 mb-2 font-semibold">What's in the Box:</h4>
                <ul className="list-inside list-disc space-y-1 text-gray-600">
                  <li>Wireless Noise Cancelling Headphones</li>
                  <li>USB-C Charging Cable</li>
                  <li>3.5mm Audio Cable</li>
                  <li>Carrying Case</li>
                  <li>User Manual</li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h3 className="mb-3 text-lg font-semibold">Technical Specifications</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded bg-gray-50 p-4">
                      <h4 className="mb-2 font-medium text-gray-800">Audio</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Driver Size</span>
                          <span>40mm</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Frequency Response</span>
                          <span>20Hz - 20kHz</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Impedance</span>
                          <span>32 Ohm</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Sensitivity</span>
                          <span>105 dB</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded bg-gray-50 p-4">
                      <h4 className="mb-2 font-medium text-gray-800">Battery</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Driver Size</span>
                          <span>40mm</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Frequency Response</span>
                          <span>20Hz - 20kHz</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Impedance</span>
                          <span>32 Ohm</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Sensitivity</span>
                          <span>105 dB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="mb-3 text-lg font-semibold">Customer Reviews</h3>
                <p className="text-gray-600">Reviews content will be displayed here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12 bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Link href="/products" className="text-indigo-600 hover:text-indigo-800">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} image={getSafeImageUrl(product.image)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </EcommerceLayout>
  )
}

export default ProductDetail
