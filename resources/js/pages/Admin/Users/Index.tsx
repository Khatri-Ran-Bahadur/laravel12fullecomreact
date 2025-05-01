import DataTable from '@/components/DataTables/DataTable';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Users } from 'lucide-react';

export default function UserIndex() {
    const { users, filters, can } = usePage().props;
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
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone', sortable: true },
        { key: 'created_at', type: 'date', label: 'Created At', sortable: true },
    ];

    const handleDelete = (id: string) => {
        router.delete(route('admin.users.destroy', id), {
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
            <Head title="Users" />
            <div className="py-6">
                <div className="mx-auto">
                    <DataTable
                        data={users}
                        columns={columns}
                        resourceName="Users"
                        singularName="User"
                        routeName="admin.users.index"
                        filters={filters}
                        canViewResource={false}
                        canCreateResource={false}
                        canEditResource={false}
                        canDeleteResource={false}
                        viewRoute="admin.users.show"
                        editRoute="admin.users.edit"
                        onDelete={handleDelete}
                        icon={Users}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
