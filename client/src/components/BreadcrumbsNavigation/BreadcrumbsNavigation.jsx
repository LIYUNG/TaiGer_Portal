import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';

export const BreadcrumbsNavigation = ({ items }) => {
    return (
        <Breadcrumbs aria-label="breadcrumb">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return isLast ? (
                    <Typography color="text.primary" key={index}>
                        {item.label}
                    </Typography>
                ) : (
                    <Link
                        color="inherit"
                        component={LinkDom}
                        key={index}
                        to={item.link}
                        underline="hover"
                    >
                        {item.label}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
};
