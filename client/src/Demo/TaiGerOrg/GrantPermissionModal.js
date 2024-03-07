import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../components/Modal';

function GrantPermissionModal(props) {
  const { t } = useTranslation();
  const [grantPermissionModalState, setGrantPermissionModalState] = useState({
    permissions:
      props.user_permissions.length > 0
        ? props.user_permissions[0]
        : { canAssignEditors: false, canAssignAgents: false },
    changed: false
  });
  console.log(grantPermissionModalState.permissions);
  // useEffect(() => {
  //   setGrantPermissionModalState((prevState) => ({
  //     ...prevState,
  //     permissions:
  //       props.user_permissions.length > 0
  //         ? props.user_permissions[0]
  //         : { canAssignEditors: false, canAssignAgents: false }
  //   }));
  // }, []);

  const onChangePermissions = (e) => {
    const { value, checked } = e.target;
    setGrantPermissionModalState((prevState) => ({
      ...prevState,
      permissions: {
        ...prevState.permissions,
        [value]: checked
      },
      changed: true
    }));
  };

  const onChangePermissions_Quota = (e) => {
    const { value, id } = e.target;
    setGrantPermissionModalState((prevState) => ({
      ...prevState,
      permissions: {
        ...prevState.permissions,
        [id]: value
      },
      changed: true
    }));
  };

  const onSubmitHandler = (e) => {
    props.onUpdatePermissions(e, grantPermissionModalState.permissions);
  };
  const permissions = [
    ['canModifyProgramList', 'Can modify program list'],
    [
      'canModifyAllBaseDocuments',
      'Can modify all Base Documents And Survey Data'
    ],
    ['canAccessAllChat', 'Can access all chat'],
    ['canAssignAgents', 'Can assign agents'],
    ['canAssignEditors', 'Can assign editors'],
    ['canModifyDocumentation', 'Can modify documentation'],
    ['canAccessStudentDatabase', 'Can access student database'],
    ['canUseTaiGerAI', 'Can use TaiGer AI']
  ];
  const permissionsQuota = [['taigerAiQuota', 'TaiGerAI Quota']];

  return (
    <ModalNew
      open={props.modalShow}
      onClose={props.setModalHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Typography>
        Edit {props.firstname} - {props.lastname} permissions:
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Permission</TableCell>
            <TableCell>Check</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions.map((permission, i) => (
            <TableRow key={i + 1}>
              <TableCell>{permission[1]}</TableCell>
              <TableCell>
                <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        type="checkbox"
                        checked={
                          grantPermissionModalState.permissions[permission[0]]
                        }
                        onChange={(e) => onChangePermissions(e)}
                        value={permission[0]}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: '1.5rem' } }}
                      />
                    }
                  />
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
          {permissionsQuota.map((permission_quota, j) => (
            <TableRow key={j + 1000}>
              <TableCell>{permission_quota[1]}</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  placeholder="1000"
                  id={permission_quota[0]}
                  name={permission_quota[0]}
                  label="Quota"
                  type="number"
                  value={
                    grantPermissionModalState.permissions[permission_quota[0]]
                  }
                  onChange={(e) => onChangePermissions_Quota(e)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        color="primary"
        variant="contained"
        disabled={!grantPermissionModalState.changed}
        onClick={(e) => onSubmitHandler(e)}
      >
        {t('Update')}
      </Button>
      <Button color="primary" variant="outlined" onClick={props.setModalHide}>
        {t('Cancel')}
      </Button>
    </ModalNew>
  );
}
export default GrantPermissionModal;
