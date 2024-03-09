// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";

// ** Icons Imports
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LockOpenIcon from "@mui/icons-material/LockOpen";

// ** Demo Tabs Imports
// import TabAccount from '../src/views/account-settings/TabAccount'
// import TabSecurity from 'src/views/account-settings/TabSecurity'
import TabAccount from "../../src/views/account-settings/TabAccount";
import TabSecurity from "../../src/views/account-settings/TabSecurity";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";
import DefaultLayout from "../../src/components/layout/DefaultLayout";

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    minWidth: 100,
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 67,
  },
}));

const TabName = styled("span")(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: "0.875rem",
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const AccountSettings = () => {
  // ** State
  const [value, setValue] = useState("account");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <DefaultLayout>
      <Box
        mx={{xs: 2, lg: 15}}
        mt={2}
        pb={5}
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 8px 5px #dcdbff",
        }}
      >
        <Card>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label="account-settings tabs"
              sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Tab
                value="account"
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PermIdentityIcon />
                    <TabName>Tài khoản</TabName>
                  </Box>
                }
              />
              <Tab
                value="security"
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LockOpenIcon />
                    <TabName>Đổi mật khẩu</TabName>
                  </Box>
                }
              />
              {/* <Tab
            value='info'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InformationOutline />
                <TabName>Info</TabName>
              </Box>
            }
          /> */}
            </TabList>

            <TabPanel sx={{ p: 0 }} value="account">
              <TabAccount />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="security">
              <TabSecurity />
            </TabPanel>
            {/* <TabPanel sx={{ p: 0 }} value='info'>
          <TabInfo />
        </TabPanel> */}
          </TabContext>
        </Card>
      </Box>
    </DefaultLayout>
  );
};

export default AccountSettings;
