import { React, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Select,
    FormControl,
    MenuItem,
    Button,
    InputLabel,
    Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { convertDate } from '../../utils/contants';
import ModalNew from '../../components/Modal';
import ProgramCompare from './ProgramCompare';

import { getProgramChangeRequests } from '../../api/index';

const ProgramDiffModal = (props) => {
    const { t } = useTranslation();
    const { originalProgram } = props;
    const programId = originalProgram._id;

    const [incomingChanges, setIncomingChanges] = useState([]);
    const [changeIndex, setChangeIndex] = useState(0);

    useEffect(() => {
        getProgramChangeRequests(programId).then((res) => {
            const { data } = res.data;
            setIncomingChanges(data);
        });
    }, [programId]);

    return (
        <ModalNew
            aria-labelledby="contained-modal-title-vcenter"
            centered
            open={props.open}
            size="lg"
        >
            <Button color="secondary" onClick={props.setModalHide}>
                <CloseIcon />
            </Button>
            <Typography variant="h6">Merge Program input </Typography>
            <FormControl fullWidth>
                <InputLabel id="request-select-label">Requests</InputLabel>
                <Select
                    id="request-select"
                    label="Requests"
                    labelId="request-select-label"
                    onChange={(e) => setChangeIndex(e.target.value)}
                    value={changeIndex}
                >
                    {incomingChanges.length > 0
                        ? incomingChanges.map((change, index) => {
                              return (
                                  <MenuItem key={index} value={index}>
                                      {convertDate(change?.updatedAt)} -{' '}
                                      {change.requestedBy
                                          ? `${change.requestedBy.firstname} ${change.requestedBy.lastname} `
                                          : 'External Source'}
                                  </MenuItem>
                              );
                          })
                        : null}
                </Select>
            </FormControl>
            <ProgramCompare
                incomingChanges={incomingChanges[changeIndex] || {}}
                originalProgram={originalProgram}
                submitCallBack={props.setModalHide}
            />
            <Button
                color="secondary"
                onClick={props.setModalHide}
                variant="outlined"
            >
                {t('Close', { ns: 'common' })}
            </Button>
        </ModalNew>
    );
};
export default ProgramDiffModal;
