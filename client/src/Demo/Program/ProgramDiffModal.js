import { React } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@mui/material';
import ModalNew from '../../components/Modal';
import ProgramCompare from './ProgramCompare';

function ProgramDiffModal(props) {
  const { t } = useTranslation();
  return (
    <ModalNew
      open={props.open}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography variant="h6">Merge Program input</Typography>
      <Button color="secondary" onClick={props.setModalHide}>
        X
      </Button>
      <ProgramCompare originalProgram={props.originalProgram} />
      <Button color="secondary" variant="outlined" onClick={props.setModalHide}>
        {t('Close', { ns: 'common' })}
      </Button>
    </ModalNew>
  );
}
export default ProgramDiffModal;
