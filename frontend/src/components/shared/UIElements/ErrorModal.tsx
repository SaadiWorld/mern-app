import Modal from "./Modal";
import Button from "../FormElements/Button";

type ErrorModalProps = {
  error: string | null;
  onClear: () => void;
};

const ErrorModal = ({ error, onClear }: ErrorModalProps) => {
  return (
    <Modal
      onCancel={onClear}
      header="An Error Occurred!"
      show={!!error}
      footer={<Button onClick={onClear}>Okay</Button>}
    >
      <p>{error}</p>
    </Modal>
  );
};

export default ErrorModal;
