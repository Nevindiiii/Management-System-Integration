import { columns, User } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/data-table';

type Props = {
  data: User[];
  onTableChange?: (table: any) => void;
};

export default function UsersTable({ data, onTableChange }: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      onTableChange={onTableChange}
      // Column customization props
      
      columnOrder={['id', 'firstName', 'lastName', 'email', 'phone', 'birthDate','age', 'actions']}
      columnWidths={{
        'id': 60,
        'firstName': 120,
        'lastName': 120,
        'email': 200,
        'phone': 140,
        'birthDate': 120,
        'age': 80,
        'actions': 120
      }}
      columnHeaders={{
        'id': 'ID',
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'email': 'Email',
        'phone': 'Phone',
        'birthDate': 'Birth Date',
        'age': 'Age',
        'actions': 'Actions'
      }}
      // Visual customization props
      striped={true}
      hoverable={true}
      size="md"
      border={true}
      rounded={true}
      showSuccessAlert={true}
      emptyMessage="No users found."
      className="mt-4"
      tableClassName="min-w-full"
    />
  );
}
