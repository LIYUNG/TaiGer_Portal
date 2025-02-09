import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import User from './User';
import UsersListSubpage from './UsersListSubpage';
import UserDeleteWarning from './UserDeleteWarning';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { deleteUser, changeUserRole, updateArchivUser } from '../../api';
import { UserlistHeader } from '../../utils/contants';
import UserArchivWarning from './UserArchivWarning';

const UsersList = (props) => {
    const { t } = useTranslation();
    const [usersListState, setUsersListState] = useState({
        error: '',
        modalShow: false,
        delete_field: '',
        firstname: '',
        lastname: '',
        selected_user_role: '',
        selected_user_id: '',
        archiv: false,
        data: props.users,
        modalShowNewProgram: false,
        deleteUserWarning: false,
        archivUserWarning: false,
        success: props.success,
        isLoaded: props.isLoaded,
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });

    useEffect(() => {
        setUsersListState((prevState) => ({
            ...prevState,
            data: props.users
        }));
    }, [props.users]);

    const setModalShow = (
        user_firstname,
        user_lastname,
        user_role,
        user_id
    ) => {
        setUsersListState((prevState) => ({
            ...prevState,
            modalShow: true,
            firstname: user_firstname,
            lastname: user_lastname,
            selected_user_role: user_role,
            selected_user_id: user_id
        }));
    };

    const setModalHide = () => {
        setUsersListState((prevState) => ({
            ...prevState,
            modalShow: false
        }));
    };

    const setModalArchivHide = () => {
        setUsersListState((prevState) => ({
            ...prevState,
            archivUserWarning: false
        }));
    };
    const setModalHideDDelete = () => {
        setUsersListState((prevState) => ({
            ...prevState,
            deleteUserWarning: false,
            delete_field: ''
        }));
    };

    const setModalShowDelete = (user_firstname, user_lastname, user_id) => {
        setUsersListState((prevState) => ({
            ...prevState,
            deleteUserWarning: true,
            firstname: user_firstname,
            lastname: user_lastname,
            selected_user_id: user_id
        }));
    };
    const setModalArchiv = (user_firstname, user_lastname, user_id, archiv) => {
        setUsersListState((prevState) => ({
            ...prevState,
            archivUserWarning: true,
            firstname: user_firstname,
            lastname: user_lastname,
            selected_user_id: user_id,
            archiv
        }));
    };
    const handleChange2 = (e) => {
        const { value } = e.target;
        setUsersListState((prevState) => ({
            ...prevState,
            selected_user_role: value
        }));
    };

    const handleDeleteUser = (user_id) => {
        // TODO: also delete files in file system
        setUsersListState((prevState) => ({
            ...prevState,
            isLoaded: false
        }));

        deleteUser(user_id).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (success) {
                    var array = [...usersListState.data];
                    let idx = usersListState.data.findIndex(
                        (user) => user._id === user_id
                    );
                    if (idx !== -1) {
                        array.splice(idx, 1);
                    }
                    setUsersListState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        success,
                        delete_field: '',
                        deleteUserWarning: false,
                        data: array,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setUsersListState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setUsersListState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const onChangeDeleteField = (e) => {
        setUsersListState((prevState) => ({
            ...prevState,
            delete_field: e.target.value
        }));
    };

    const assignUserAs = (user_data) => {
        var updated_user = usersListState.data.map((user) => {
            if (user._id === user_data._id) {
                return Object.assign(user, user_data);
            } else {
                return user;
            }
        });

        changeUserRole(user_data._id, user_data.role).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (success) {
                    setUsersListState((prevState) => ({
                        ...prevState,
                        modalShow: false,
                        isLoaded: true,
                        success,
                        data: updated_user,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setUsersListState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setUsersListState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const onSubmit2 = (e) => {
        e.preventDefault();
        const user_role = usersListState.selected_user_role;
        const user_id = usersListState.selected_user_id;
        assignUserAs({ role: user_role, _id: user_id });
    };

    const updateUserArchivStatus = (user_id, isArchived) => {
        updateArchivUser(user_id, isArchived).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setUsersListState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        archivUserWarning: false,
                        data: data,
                        success: success,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setUsersListState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setUsersListState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const ConfirmError = () => {
        setUsersListState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const { res_modal_message, res_modal_status } = usersListState;

    const headers = (
        <TableRow>
            <TableCell> </TableCell>
            {UserlistHeader.map((x, i) => (
                <TableCell key={i}>{t(`${x.name}`)}</TableCell>
            ))}
            <TableCell>{t('Created At')}</TableCell>
            <TableCell>{t('Last Login', { ns: 'auth' })}</TableCell>
        </TableRow>
    );

    const users = usersListState.data.map((user) => (
        <User
            key={user._id}
            setModalArchiv={setModalArchiv}
            setModalShow={setModalShow}
            setModalShowDelete={setModalShowDelete}
            success={usersListState.success}
            user={user}
        />
    ));

    return (
        <>
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
            <Table size="small">
                <TableHead>{headers}</TableHead>
                <TableBody>{users}</TableBody>
            </Table>
            <UsersListSubpage
                firstname={usersListState.firstname}
                handleChange2={handleChange2}
                lastname={usersListState.lastname}
                onSubmit2={onSubmit2}
                selected_user_id={usersListState.selected_user_id}
                selected_user_role={usersListState.selected_user_role}
                setModalHide={setModalHide}
                show={usersListState.modalShow}
            />
            <UserDeleteWarning
                deleteUserWarning={usersListState.deleteUserWarning}
                delete_field={usersListState.delete_field}
                firstname={usersListState.firstname}
                handleDeleteUser={handleDeleteUser}
                isLoaded={usersListState.isLoaded}
                lastname={usersListState.lastname}
                onChangeDeleteField={onChangeDeleteField}
                selected_user_id={usersListState.selected_user_id}
                setModalHideDDelete={setModalHideDDelete}
            />
            <UserArchivWarning
                archiv={usersListState.archiv}
                archivUserWarning={usersListState.archivUserWarning}
                firstname={usersListState.firstname}
                isLoaded={usersListState.isLoaded}
                lastname={usersListState.lastname}
                selected_user_id={usersListState.selected_user_id}
                setModalArchivHide={setModalArchivHide}
                updateUserArchivStatus={updateUserArchivStatus}
            />
        </>
    );
};

export default UsersList;
