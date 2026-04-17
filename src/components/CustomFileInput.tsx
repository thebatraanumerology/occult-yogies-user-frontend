import React, { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { RotateCcw, RotateCw, Check, X } from "lucide-react";
import { CustomFileInputProps } from "../types/componentTypes";

const CustomFileInput: React.FC<CustomFileInputProps> = ({ onChange, error, value }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);

  const [fileName, setFileName] = useState<string>("");
  const [rawSrc, setRawSrc] = useState<string>("");  // base64 → fed to Cropper
  const [previewSrc, setPreviewSrc] = useState<string>("");  // thumbnail after Apply
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [origFile, setOrigFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (!value) {
      setFileName("");
      setRawSrc("");
      setPreviewSrc("");
      setOrigFile(null);
    }
  }, [value]);

  // ── File selected → read as base64 → open crop modal ─────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    setFileName(file.name);
    setOrigFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawSrc(ev.target?.result as string);
      setTimeout(() => setModalOpen(true), 50); // give DOM time to mount Cropper
    };
    reader.readAsDataURL(file);
  };

  // ── Cropper rotation controls ─────────────────────────────────────────────
  const rotateLeft = () => cropperRef.current?.cropper.rotate(-90);
  const rotateRight = () => cropperRef.current?.cropper.rotate(90);

  // ── Apply → small thumbnail for preview, emit original File to parent ─────
  const applyCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({ maxWidth: 400, maxHeight: 400 });
    if (canvas) setPreviewSrc(canvas.toDataURL("image/jpeg", 0.8));

    onChange?.(origFile);
    closeModal();
  };

  const closeModal = () => {
    setModalOpen(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      {/* ── Trigger row — same width & style as all other CustomInput fields ── */}
      <div className="relative w-full lg:w-3/4 lg:max-w-3/4 min-w-2/3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"       // images only — no PDF, no doc
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => inputRef.current?.click()}
          className={`flex items-center text-sm w-full rounded-lg border ${error ? 'border-red-500' : 'border-black/10'} bg-white text-base overflow-hidden cursor-pointer focus-within:ring focus-within:ring-black/30 transition`}
        >
          <span className="px-3 py-2 bg-magenta text-white font-normal whitespace-nowrap select-none">
            Choose file
          </span>
          <span className={`px-3 py-2 truncate flex-1 text-start ${fileName ? "text-black" : "text-black/30"}`}>
            {fileName || "No file chosen"}
          </span>
        </div>

        {/* Thumbnail shown after Apply */}
        {previewSrc && (
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Check size={13} className="text-borderGreen" />
              <span className="text-xs text-borderGreen font-medium">Image ready</span>
            </div>
            <img
              src={previewSrc}
              alt="preview"
              className="max-w-30 rounded-md border-2 border-borderGreen"
            />
          </div>
        )}
      </div>

      {/* ── Crop modal ────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-170 max-w-[95vw] p-6 flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-magenta">Crop Image</h3>
              <button
                onClick={closeModal}
                className="text-black/40 hover:text-black transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="rounded-lg border border-black/10">
              {rawSrc && (
                <Cropper
                  ref={cropperRef}
                  src={rawSrc}
                  style={{ height: 380, width: "100%", minHeight: 380 }}
                  aspectRatio={NaN}
                  viewMode={1}
                  autoCropArea={1}
                  movable
                  zoomable
                  rotatable
                  scalable
                  cropBoxResizable
                  cropBoxMovable
                  responsive
                  guides={false}
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={rotateLeft}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-bgYellow bg-bgYellow/40 text-sm font-medium text-black hover:bg-bgYellow transition cursor-pointer"
              >
                <RotateCcw size={15} /> Rotate Left
              </button>

              <button
                type="button"
                onClick={rotateRight}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-bgYellow bg-bgYellow/40 text-sm font-medium text-black hover:bg-bgYellow transition cursor-pointer"
              >
                <RotateCw size={15} /> Rotate Right
              </button>

              <button
                type="button"
                onClick={applyCrop}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-magenta text-white text-sm font-medium hover:opacity-90 transition cursor-pointer"
              >
                <Check size={15} /> Apply
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default CustomFileInput;