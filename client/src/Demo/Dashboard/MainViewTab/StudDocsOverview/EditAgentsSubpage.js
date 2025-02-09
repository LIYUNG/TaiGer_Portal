import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAgents } from '../../../../api';

const EditAgentsSubpage = (props) => {
    const { t } = useTranslation();
    const [checkboxState, setCheckboxState] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Initialize the state with checked checkboxes based on the student's agents
        getAgents().then(
            (resp) => {
                // TODO: check success
                const { data, success } = resp.data;
                if (success) {
                    const agents = data; //get all agent
                    const { agents: student_agents } = props.student;
                    const updateAgentList = agents.reduce(
                        (prev, { _id }) => ({
                            ...prev,
                            [_id]: student_agents
                                ? student_agents.findIndex(
                                      (student_agent) =>
                                          student_agent._id === _id
                                  ) > -1
                                : false
                        }),
                        {}
                    );
                    setCheckboxState({ agents, updateAgentList });
                    setIsLoaded(true);
                } else {
                    setIsLoaded(true);
                }
            },
            () => {
                // const { statusText } = resp;
                throw new Response('No data', { status: 500 });
                // setIsLoaded(true);
            }
        );
    }, [props.student.agents]);

    const handleChangeAgentlist = (e) => {
        const { value } = e.target;
        setCheckboxState((prevState) => ({
            ...prevState,
            updateAgentList: {
                ...prevState.updateAgentList,
                [value]: !prevState.updateAgentList[value]
            }
        }));
    };

    let agentlist = checkboxState.agents ? (
        checkboxState.agents.map((agent, i) => (
            <TableRow key={i + 1}>
                <TableCell>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={
                                    checkboxState?.updateAgentList[agent._id] ||
                                    false
                                }
                                onChange={(e) => handleChangeAgentlist(e)}
                                value={agent._id}
                            />
                        }
                        label={`${agent.lastname} ${agent.firstname}`}
                    />
                </TableCell>
            </TableRow>
        ))
    ) : (
        <TableRow>
            <TableCell>
                <Typography variant="h6">{t('No Agent')}</Typography>
            </TableCell>
        </TableRow>
    );

    return (
        <Dialog
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onClose={props.onHide}
            open={props.show}
            size="large"
        >
            <DialogTitle>
                Agent for {props.student.firstname} - {props.student.lastname}{' '}
                to
            </DialogTitle>
            <DialogContent>
                {isLoaded ? (
                    <>
                        <Typography variant="body1">
                            {t('Agent', { ns: 'common' })}:{' '}
                        </Typography>
                        <Table size="small">
                            <TableBody>{agentlist}</TableBody>
                        </Table>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                color="primary"
                                onClick={(e) =>
                                    props.submitUpdateAgentlist(
                                        e,
                                        checkboxState.updateAgentList,
                                        props.student._id
                                    )
                                }
                                sx={{ mr: 2 }}
                                variant="contained"
                            >
                                {t('Update', { ns: 'common' })}
                            </Button>
                            <Button
                                color="secondary"
                                onClick={props.onHide}
                                variant="outlined"
                            >
                                {t('Cancel', { ns: 'common' })}
                            </Button>
                        </Box>
                    </>
                ) : (
                    <CircularProgress size={24} />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditAgentsSubpage;
