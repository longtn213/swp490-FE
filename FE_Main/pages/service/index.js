import DefaultLayout from "../../src/components/layout/DefaultLayout";
import {
  Box,
  Breadcrumbs,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TablePagination,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchBar from "../../src/components/search-bar/SearchBar";
import VerticalCategory from "../../src/components/category/VerticalCategory";
import { useEffect, useState } from "react";
import { filterService } from "../../src/api/service/serviceApi";
import DialogAlert from "../../src/components/dialog/dialogAlert";
import ServiceCard from "../../src/components/card/service-card/ServiceCard";
import { getAllServices } from "../../src/api/common/commonApi";
import Head from "next/head";
import Link from "next/link";

const ServiceList = () => {
  const breadcrumbs = [
    <Link underline="hover" key="1" href="/">
      Trang chủ
    </Link>,
    <Typography key="2" color="text.primary">
      Danh sách dịch vụ
    </Typography>,
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const callFilterFromProps = (pageProp, sizeProp) => {
    callFilter(pageProp, sizeProp);
  };

  const defaultQueryParam = {
    sort: {
      value: "",
    },
    serviceName: {
      value: "",
      operator: "contains",
    },
    serviceCategory: {
      value: "",
      operator: "in",
    },
    currentPriceGreaterThan: {
      value: "",
      operator: "greaterThanOrEqual",
    },
    currentPriceLowerThan: {
      value: "",
      operator: "lessThanOrEqual",
    },
  };

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [queryParam, setQueryParam] = useState(defaultQueryParam);

  const {
    sort,
    serviceName,
    serviceCategory,
    currentPriceGreaterThan,
    currentPriceLowerThan,
  } = queryParam;

  const listSortOptions = [
    {
      name: "Tên (A - Z)",
      code: "name,asc",
    },
    {
      name: "Tên (Z - A)",
      code: "name,desc",
    },
    {
      name: "Giá (thấp - cao)",
      code: "currentPrice,asc",
    },
    {
      name: "Giá (cao - thấp)",
      code: "currentPrice,desc",
    },
    {
      name: "Thời gian ước tính (thấp - cao)",
      code: "duration,asc",
    },
    {
      name: "Thời gian ước tính (cao - thấp)",
      code: "duration,desc",
    },
  ];

  const onChangeTextAndSelectField = (e) => {
    e.preventDefault();

    setQueryParam({
      ...queryParam,
      [`${e.target.name}`]: {
        ...queryParam[`${e.target.name}`],
        ["value"]: e.target.value,
      },
    });
  };

  const onChangeCategory = (category) => {
    setQueryParam({
      ...queryParam,
      serviceCategory: {
        ...queryParam[serviceCategory],
        ["value"]: category.code,
        operator: "in",
      },
    });
  };

  const onSelectAllCategory = () => {
    setQueryParam({
      ...queryParam,
      serviceCategory: {
        ...queryParam[serviceCategory],
        ["value"]: "",
        operator: "in",
      },
    });
  };

  const [list, setList] = useState();
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);

  const handleClose = () => {
    setOpenError(false);
  };

  const callFilter = async (pageProp, sizeProp) => {
    const data = await filterService(
      queryParam ? queryParam : defaultQueryParam,
      pageProp,
      sizeProp
    );
    if (!data) return;
    if (data.meta.code != 200) {
      setError(data.meta.message);
      setOpenError(true);
      return;
    }
    if (!data.data) return;
    setCount(data.meta.total);
    var tempList = data.data.filter(item => item.isActive === true)
    setList(tempList);
    // setCount(tempList.length);
    console.log(queryParam);
  };

  const callServiceList = async () => {
    const data = await getAllServices();
    if (!data) return;
    if (data.meta.code != 200) {
      setError(data.meta.message);
      setOpenError(true);
      return;
    }
    let tempList = [];
    tempList = [...data.data];
    let highestPrice = 0;
    tempList?.forEach((item) => {
      if (item.currentPrice > highestPrice) highestPrice = item.currentPrice;
    });
    setRange([0, highestPrice]);
    setValue([0, highestPrice]);
  };

  //range slider

  function valuetext(value) {
    return `${currencyFormatter.format(value)}`;
  }

  const [value, setValue] = useState([0, 0]);
  const [range, setRange] = useState([0, 0]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setQueryParam({
      ...queryParam,
      currentPriceGreaterThan: {
        ["value"]: `${newValue[0]}`,
        operator: "greaterThanOrEqual",
      },
      currentPriceLowerThan: {
        ["value"]: `${newValue[1]}`,
        operator: "lessThanOrEqual",
      },
    });
    console.log(newValue);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    callFilter(page, size);
    callServiceList();
    const currentSearchFromHomepage =
      localStorage.getItem("searchFromHomepage");
    if (currentSearchFromHomepage) {
      setQueryParam({
        ...queryParam,
        serviceName: {
          ["value"]: currentSearchFromHomepage,
          operator: "contains",
        },
      });
      localStorage.removeItem("searchFromHomepage");
    }
    const currentSelectCateFromHomepage = localStorage.getItem(
      "selectCateFromHomepage"
    );
    if (currentSelectCateFromHomepage) {
      setQueryParam({
        ...queryParam,
        serviceCategory: {
          ...queryParam[serviceCategory],
          ["value"]: currentSelectCateFromHomepage,
          operator: "in",
        },
      });
      localStorage.removeItem("selectCateFromHomepage");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    callFilter(page, size);
  }, [page, size, queryParam, value]);

  //format tien VND

  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <DefaultLayout>
      
      <Box
        mx={{xs: 2, lg: 15}}
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 8px 5px #dcdbff",
        }}
      >
        <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: "medium" }} />}
        aria-label="breadcrumb"
        // mx={15}
        mt={3}
        mb={1}
      >
        {breadcrumbs}
      </Breadcrumbs>
        <Head>
          <title>Danh sách dịch vụ - SSDS</title>
        </Head>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", pt: 4, fontWeight: "800" }}
        >
          Danh sách dịch vụ
        </Typography>

        <Grid container spacing={5} justifyContent="space-around">
          <Grid item xs={12} md={2.5} mt={4}>
            <Grid item xs={12}>
              <SearchBar
                label="Tìm dịch vụ"
                placeholder="Nhập dịch vụ bạn muốn tìm"
                onChangeTextAndSelectField={onChangeTextAndSelectField}
              />
            </Grid>
            <Grid item display={{ xs: "none", md: "block" }}>
              <VerticalCategory
                xs={0}
                onChangeCategory={onChangeCategory}
                onSelectAllCategory={onSelectAllCategory}
              />
            </Grid>
          </Grid>
          <Grid item sm={12} md={9.5}>
            <Typography variant="h6" sx={{ textAlign: "center", my: 2 }}>
              Bộ lọc
            </Typography>

            <Grid container className="filter" sx={{ alignItems: "center" }}>
              <Grid item sm={12} md={6}>
                <Box
                  sx={{
                    minWidth: 250,
                    display: "flex",
                    maxWidth: 600,
                    m: "10px auto",
                  }}
                >
                  <Typography my={"auto"} mr={2}>
                    Thứ tự sắp xếp
                  </Typography>
                  <FormControl>
                    <InputLabel id="select-label">Sắp xếp theo</InputLabel>
                    <Select
                      labelId="select-label"
                      label="Sắp xếp theo"
                      name="sort"
                      size="small"
                      value={sort.value}
                      onChange={onChangeTextAndSelectField}
                      sx={{
                        width: "auto",
                        minWidth: 150,
                        maxWidth: 300,
                        textAlign: "center",
                      }}
                    >
                      {listSortOptions.map((item, index) => {
                        // if (item.isActive === true) {
                          return (
                            <MenuItem key={index} value={item?.code}>
                              {item?.name}
                            </MenuItem>
                          );
                        // }
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item sm={12} md={6}>
                <Box sx={{ minWidth: 250, maxWidth: 600, m: "0 auto" }}>
                  <Typography my={"auto"} mr={2}>
                    Khoảng giá: {currencyFormatter.format(value[0])} đến{" "}
                    {currencyFormatter.format(value[1])}
                  </Typography>
                  <Box sx={{ width: "100%" }}>
                    <Slider
                      sx={{ width: "90%" }}
                      getAriaLabel={() => "Temperature range"}
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      valueLabelFormat={valuetext}
                      getAriaValueText={valuetext}
                      min={range[0]}
                      max={range[1]}
                      step={500000}
                      marks
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {list?.map((item, key) => {
                  // if (item.isActive === true) {
                    return (
                      <Grid
                        key={key}
                        item
                        xs={6}
                        sm={4}
                        lg={2.4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {item.files && item.files[0].url ? (
                          <ServiceCard item={item} url={item.files[0].url} />
                        ) : (
                          <ServiceCard
                            item={item}
                            url="https://bucket.nhanh.vn/store/24031/ps/20220808/08082022040820_thumb_web_01__1__thumb.jpg"
                          />
                        )}
                      </Grid>
                    );
                  // }
                })}
              </Grid>
            </Grid>

            <TablePagination
              component="div"
              count={count}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={size}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số dịch vụ trên mỗi trang:"
              labelDisplayedRows={function defaultLabelDisplayedRows({
                from,
                to,
                count,
              }) {
                return `Hiển thị ${from}–${to} trên ${
                  count !== -1 ? count : `nhiều hơn ${to}`
                } dịch vụ`;
              }}
            />
          </Grid>
        </Grid>
        <DialogAlert
          nameDialog={"Có lỗi xảy ra"}
          open={openError}
          allertContent={error}
          handleClose={handleClose}
          callFilterFromProps={callFilterFromProps}
        />
      </Box>
    </DefaultLayout>
  );
};

export default ServiceList;
