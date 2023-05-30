import { QRCode } from "react-qrcode-logo";
import { Backdrop, styled } from "@mui/material";

type Props = {
  qrOpen: boolean;
  onClose: () => void;
};

const QRBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: "#fff",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
}));

export const QR = ({ qrOpen, onClose }: Props) => (
  <div>
    <QRBackdrop open={qrOpen} onClick={onClose}>
      <QRCode value="https://sprout2000.github.io/menjikan" />
    </QRBackdrop>
  </div>
);
