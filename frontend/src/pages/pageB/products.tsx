import { DataTablePagination } from '@/components/customUi/pagination';
import RowsPerPageSelect from '@/components/customUi/rows-per-page-select';
import React from 'react';
import { columns, User } from '@/components/data-table/columns';
import { productColumns } from '@/pages/pageB/tables/table-columns/product-columns';
import { useUsers } from '@/hooks/useUserQueries';
import { useProducts } from '@/hooks/useProductQueries';
import { Input } from '@/components/ui/input';
import TableColumnsDropdown from '@/components/data-table/table-columns-dropdown';
import SuccessAlert from '@/components/customUi/success-alert';
import { DataTable } from '@/components/data-table/data-table';

type Props = {
  data?: User[];
};

export default function UsersTable({ data }: Props) {
  const { data: apiData } = useUsers();
  const { data: productsData } = useProducts();
  const [table, setTable] = React.useState<any | null>(null);
  const [successOpen, setSuccessOpen] = React.useState(false);

  // State for data-based pagination
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize] = React.useState(10);

  // Get the actual data array for pagination - prioritize products data
  const actualData = productsData ?? data ?? apiData ?? [];

  // helper to support both the raw TanStack table instance and the
  // wrapper API object we pass from DataTable (which contains a `table` field).

  const getColumn = React.useCallback(
    (id: string) => {
      if (!table) return undefined;
      try {
        if (typeof table.getColumn === 'function') {
          const column = table.getColumn(id);
          return column || undefined;
        }
        if (table.table && typeof table.table.getColumn === 'function') {
          const column = table.table.getColumn(id);
          return column || undefined;
        }
      } catch (error) {
        return undefined;
      }
      return undefined;
    },
    [table]
  );

  // Build a lightweight columns array for the dropdown and a toggle handler
  const dropdownColumns = React.useMemo(() => {
    if (!table) return [];
    const currentColumns = productsData ? productColumns : columns;
    return currentColumns.map((col: any) => {
      const id = col.id ?? col.accessorKey;
      const label = typeof col.header === 'string' ? col.header : id;
      const column = getColumn(id);
      const isVisible = column?.getIsVisible?.() ?? true;
      return { id, label, isVisible };
    });
  }, [columns, productColumns, table, getColumn, productsData]);

  const handleToggleColumn = React.useCallback(
    (id: string, visible: boolean) => {
      // Prefer the table API if available
      const col = getColumn(id);
      if (col?.toggleVisibility) {
        col.toggleVisibility(visible);
        return;
      }

      // Fallback to setColumnVisibility if provided on the table wrapper
      if (table?.setColumnVisibility) {
        table.setColumnVisibility(id, visible);
        return;
      }
      if (table?.table?.setColumnVisibility) {
        table.table.setColumnVisibility(id, visible);
        return;
      }
    },
    [table, getColumn]
  );

  return (
    <div className="">
      <h2 className="mb-4 text-2xl font-bold">Products Data</h2>

      <div className="mb-5 flex">
        <Input
          placeholder={productsData ? "Filter products..." : "Filter names..."}
          value={(() => {
            if (!table) return '';
            const filterColumn = getColumn(productsData ? 'title' : 'firstName');
            return (filterColumn?.getFilterValue() as string) ?? '';
          })()}
          onChange={(event) => {
            if (table) {
              const filterColumn = getColumn(productsData ? 'title' : 'firstName');
              filterColumn?.setFilterValue?.(event.target.value);
            }
          }}
          className="max-w-sm"
        />

        <TableColumnsDropdown
          columns={dropdownColumns}
          onToggleColumn={handleToggleColumn}
        />
      </div>

      {/* <SuccessAlert open={successOpen} onOpenChange={setSuccessOpen} /> */}

      <DataTable
        columns={productsData ? productColumns : columns as any}
        data={actualData as any}
        onTableChange={setTable}
        columnHeaders={{
          name: "Name",
          username: "Username",
          phone: "Phone",
          email: "Email",
          id: "ID",
          website: "Website",
          title: "Product Title",
          brand: "Brand",
          category: "Category",
          price: "Price",
          rating: "Rating",
          stock: "Stock"
        }}
        hiddenColumns={["id"]}
      />

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <RowsPerPageSelect
            value={`${table?.pageSize ?? 10}`}
            onValueChange={(value) => table?.setPageSize?.(Number(value))}
            className="h-8 w-[70px]"
          />
        </div>
        <DataTablePagination
          data={actualData as any}
          pageSize={pageSize}
          pageIndex={currentPage}
          onPageChange={setCurrentPage}
          showPageJump={true}
        />
      </div>
    </div>
  );
}
