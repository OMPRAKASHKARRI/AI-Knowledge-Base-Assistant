import type { FileType } from '../../types';

const STYLES: Record<FileType, string> = {
  pdf: 'border-signal-error/40 text-signal-error',
  txt: 'border-ink-400/50 text-ink-600',
  md: 'border-ledger-500/40 text-ledger-500',
};

const FileTypeStamp = ({ fileType }: { fileType: FileType }) => (
  <span className={`stamp ${STYLES[fileType]}`}>{fileType}</span>
);

export default FileTypeStamp;
