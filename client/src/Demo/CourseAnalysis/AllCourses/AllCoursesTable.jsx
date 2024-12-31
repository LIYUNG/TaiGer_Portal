// import { useState } from 'react';
import {
  MaterialReactTable,
  // MRT_TopToolbar,
  useMaterialReactTable
} from 'material-react-table';
import { useTranslation } from 'react-i18next';
import { getTableConfig, useTableStyles } from '../../../components/table';

// import { AssignProgramsToStudentDialog } from './AssignProgramsToStudentDialog';

export const AllCoursesTable = ({ isLoading, data }) => {
  const customTableStyles = useTableStyles();
  const { t } = useTranslation();
  const tableConfig = getTableConfig(customTableStyles, isLoading);
  // const [openAssignDialog, setOpenAssignDialog] = useState(false);

  const columns = [
    {
      accessorKey: 'all_course_chinese',
      header: t('Course Name (ZH)', { ns: 'common' }),
      filterFn: 'contains',
      size: 240
    },
    {
      accessorKey: 'all_course_english',
      header: t('Course Name (EN)', { ns: 'common' }),
      filterFn: 'contains',
      size: 240
    }
  ];

  const table = useMaterialReactTable({
    ...tableConfig,
    columns,
    state: { isLoading },
    data: data || []
  });

  // const handleAssignClick = () => {
  //   setOpenAssignDialog(true);
  // };

  // const handleDialogClose = () => {
  //   setOpenAssignDialog(false);
  // };

  // const handleOnSuccess = () => {
  //   table.resetRowSelection();
  //   setOpenAssignDialog(false);
  // };

  //   const handleGetSelectedRows = () => {
  //     const selectedRows = table
  //       .getSelectedRowModel()
  //       .rows.map((row) => row.original); // Extract original row data
  //     console.log('Selected Rows:', selectedRows);
  //     alert(`Selected Rows: ${JSON.stringify(selectedRows, null, 2)}`);
  //   };

  // table.options.renderTopToolbar = (
  //   <MRT_TopToolbar
  //     table={table}
  //     toolbarStyle={customTableStyles.toolbarStyle}
  //     onAssignClick={handleAssignClick}
  //   />
  // );
  return (
    <>
      <MaterialReactTable table={table} />
      {/* <AssignProgramsToStudentDialog
        open={openAssignDialog}
        onClose={handleDialogClose}
        programs={table
          .getSelectedRowModel()
          .rows?.map(
            ({
              original: { _id, school, program_name, degree, semester }
            }) => ({
              _id,
              school,
              program_name,
              degree,
              semester
            })
          )}
        handleOnSuccess={handleOnSuccess}
      /> */}
    </>
  );
};
