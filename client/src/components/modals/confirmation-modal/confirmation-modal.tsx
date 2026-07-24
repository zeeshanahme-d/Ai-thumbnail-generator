import { FiAlertTriangle } from 'react-icons/fi';

import { Button, Modal } from 'antd';
import twc from 'tw-classnames';

import { IConfirmationModalProps } from './IConfirmationModal';

// ─── Reusable confirmation modal ────────────────────────────────────────────────
function ConfirmationModal({
  open,
  title,
  description,
  icon,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: IConfirmationModalProps) {
  return (
    <Modal open={open} onCancel={onCancel} centered width={440} mask={{ closable: false }} footer={null}>
      <div className='flex flex-col items-center text-center gap-4 pt-2'>
        <div
          className={twc(
            'flex-centered w-14 h-14 rounded-full',
            danger ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
          )}
        >
          {icon ?? <FiAlertTriangle size={26} />}
        </div>

        <div className='flex flex-col gap-1.5'>
          <h2 className='text-lg font-semibold text-text-primary'>{title}</h2>
          {description && <p className='text-sm text-text-secondary'>{description}</p>}
        </div>

        <div className='flex items-center gap-3 w-full mt-2'>
          <Button onClick={onCancel} disabled={loading} className='flex-1 h-11! rounded-lg'>
            {cancelText}
          </Button>
          <Button
            type='primary'
            danger={danger}
            loading={loading}
            onClick={onConfirm}
            className='flex-1 h-11! rounded-lg'
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
