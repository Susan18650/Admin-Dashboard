import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What do the voucher statuses mean?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            • Active: The voucher code is active and can be used
          </Typography>
          <Typography>
            • Unused: Means the voucher code has not been used, but does not guarantee that it is active. For example, it may have expired but not been used.
          </Typography>
          <Typography>
            • Used: This status indicates that the voucher code has been used in a transaction. However, it did not provide details about what the transaction was. For example, if you enter a voucher code when checking out online and then cancel your order, the voucher code may still be marked as “used” even though you have not received any products or services.
          </Typography>
          <Typography>
            • Redeemed: This status indicates that the voucher code has been redeemed for a specific product or service. This means, not only has the voucher code been used, but the user has also received benefits from using that voucher code.
          </Typography>
          <Typography>
            • Expired: Voucher code has expired.
          </Typography>
          <Typography>
            • Inactive: Voucher code is inactive or has been disabled.
          </Typography>
          <Typography>
            • Cancelled: Voucher code has been canceled.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Decentralization system
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            • Admin: Highest level of authority, can delegate authority to other accounts, add/edit/delete data, create new users.
          </Typography>
          <Typography>
            • Moderator: Can add/edit data, add new users, grant account permissions but cannot grant higher permissions than yourself.
          </Typography>
          <Typography>
            • Other authorized users cannot access this page.
          </Typography>
        </AccordionDetails>
      </Accordion>

    </Box>
  );
};

export default FAQ;
