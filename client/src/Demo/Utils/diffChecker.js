import React from 'react';
import { useTheme } from '@mui/material';
import { diffChars } from 'diff';

const useHighlightColors = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [addTextColor, addTextBg] =
        mode === 'dark'
            ? [theme.palette.success.contrastText, theme.palette.success.dark]
            : [theme.palette.success.dark, theme.palette.success.light];

    const [removeTextColor, removeTextBg] =
        mode === 'dark'
            ? [theme.palette.error.contrastText, theme.palette.error.light]
            : [theme.palette.error.light, theme.palette.error.dark];

    return { addTextColor, addTextBg, removeTextColor, removeTextBg };
};

const HighlightTextDiff = ({ original = '', updated = '' }) => {
    const { addTextColor, addTextBg, removeTextColor, removeTextBg } =
        useHighlightColors();

    const diff = diffChars(`${original}`, `${updated}`);
    return diff.map((part, index) => {
        const { added, removed } = part;
        const color = added ? addTextColor : removed ? removeTextColor : '';
        const background = added ? addTextBg : removed ? removeTextBg : 'none';
        const textDecoration = removed ? 'line-through' : 'none';
        return (
            <span
                key={index}
                style={{
                    color,
                    background,
                    textDecoration
                }}
            >
                {part.value}
            </span>
        );
    });
};

export { HighlightTextDiff };
