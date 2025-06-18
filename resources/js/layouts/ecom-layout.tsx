import Footer from '@/components/ecommerce/Footer';
import Header from '@/components/ecommerce/Header';
import { Head } from '@inertiajs/react';
import "../../css/ecommerce.css"; // Ensure you have the correct path to your CSS file

interface EcommerceLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function EcomLayout({ children, title = 'R-Mart' }: EcommerceLayoutProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="R-Mart - Your one-stop online shopping destination" />
                <meta name="keywords" content="ecommerce, online shopping, electronics, fashion, groceries" />
                <meta name="author" content="R-Mart Team" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main>{children}</main>
                <Footer />
            </div>
        </>
    );
}
