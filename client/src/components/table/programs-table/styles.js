export const useTableStyles = () => {
    return {
        tableHeadCellStyle: {
            padding: '16px 8px',
            '& .MuiInputAdornment-root': {
                height: '32px'
            },
            '& .MuiSvgIcon-root': {
                fontSize: '20px'
            }
        },
        toolbarStyle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 'fit-content',
            padding: '0 0 8px 0',
            flexWrap: 'wrap',
            backgroundColor: 'transparent'
        }
    };
};
