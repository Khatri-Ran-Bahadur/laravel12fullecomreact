import DataTable from '@/components/DataTables/DataTable';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { TagIcon } from 'lucide-react';

export default function CategoryIndex() {
    const { categories, filters, can } = usePage().props;
    const columns = [
        {
            key: 'index',
            label: '#',
            sortable: false,
            type: 'IndexColumn',
            width: '80px',
            render: (item: any, index: number) => {
                return (filters.page - 1) * filters.perPage + index + 1;
            },
        },
        { key: 'image', label: 'Image', sortable: false, type: 'image', design: 'rec' },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'slug', label: 'Slug', sortable: false },
        { key: 'parent_name', label: 'Parent Name', sortable: false },
        { key: 'created_at', type: 'date', label: 'Created At', sortable: true },
    ];

    const handleDelete = (id: string) => {
        router.delete(route('admin.categories.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                // toast.success('User deleted successfully');
            },
            onError: () => {
                // toast.error('User deletion failed');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Categories" />
            <div className="py-6">
                <div className="mx-auto">
                    <DataTable
                        data={categories}
                        columns={columns}
                        resourceName="Categories"
                        singularName="Category"
                        routeName="admin.categories.index"
                        filters={filters}
                        canViewResource={false}
                        canCreateResource={true}
                        canEditResource={true}
                        canDeleteResource={true}
                        createRoute="admin.categories.create"
                        viewRoute="admin.categories.show"
                        editRoute="admin.categories.edit"
                        onDelete={handleDelete}
                        icon={TagIcon}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
