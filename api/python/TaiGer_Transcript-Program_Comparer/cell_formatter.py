def red_out_failed_subject(workbook, worksheet, row_begin, row_end):
    fmt1 = workbook.add_format({'bg_color': 'red'})
    fmt2 = workbook.add_format()

    column_range = 'C' + str(row_begin)+':C' + str(row_end)
    worksheet.conditional_format(column_range, {'type': 'blanks',
                                                'stop_if_true': True,
                                                'format': fmt2})
    worksheet.conditional_format(column_range, {'type': 'cell',
                                                'criteria': 'between',
                                                'minimum': 4.5,
                                                'maximum': 59,
                                                'format': fmt1})


def red_out_insufficient_credit(workbook, worksheet):
    print("red_out_insufficient_credit")
