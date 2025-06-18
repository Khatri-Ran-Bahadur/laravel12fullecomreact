import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    children: Category[];
}

interface CategoryMenuItemProps {
    category: Category;
}

export default function CategoryMenuItem({ category }: CategoryMenuItemProps) {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    return (
        <div className="nested-dropdown relative">
            {category.children?.length > 0 ? (
                <>
                    <a
                        href="#"
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                        onMouseEnter={() => setIsSubMenuOpen(true)}
                        onMouseLeave={() => setIsSubMenuOpen(false)}
                    >
                        <div className="flex items-center">
                            <i className={`fas fa-${category.icon || 'folder'} mr-3 text-indigo-500`}></i>
                            <span>{category.name}</span>
                        </div>
                        <i className="fas fa-chevron-right text-xs"></i>
                    </a>
                    {isSubMenuOpen && (
                        <div
                            className="nested-dropdown-menu absolute top-0 left-full w-64 rounded-md bg-white shadow-lg"
                            onMouseEnter={() => setIsSubMenuOpen(true)}
                            onMouseLeave={() => setIsSubMenuOpen(false)}
                        >
                            {category.children.map((childCategory) => (
                                <CategoryMenuItem key={childCategory.id} category={childCategory} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <Link href={`/category/${category.slug}`} className="flex items-center px-4 py-3 hover:bg-gray-100">
                    <i className={`fas fa-${category.icon || 'folder'} mr-3 text-indigo-500`}></i>
                    <span>{category.name}</span>
                </Link>
            )}
        </div>
    );
}
