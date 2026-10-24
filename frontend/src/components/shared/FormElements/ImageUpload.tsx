import { useEffect, useRef, useState, type ChangeEvent } from "react";

import Button from "./Button";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  id: string;
  errorText: string;
  center?: boolean;
  onInput: (id: string, file: File | null, isValid: boolean) => void;
}

const ImageUpload = (props: ImageUploadProps) => {
  const [file, setFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        setPreviewUrl(fileReader.result);
      }
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const pickedFile = event.target.files?.[0];
    if (pickedFile) {
      setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    props.onInput(props.id, pickedFile ?? null, Boolean(pickedFile));
  };

  const pickImageHandler = () => {
    filePickerRef.current?.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div
        className={`${styles.imageUpload} ${props.center ? styles.center : ""}`}
      >
        <div className={styles.imageUploadPreview}>
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
