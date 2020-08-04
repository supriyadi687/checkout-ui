import React, {useState} from "react";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FilledInput from "@material-ui/core/FilledInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";

import { PaymentService } from './service/PaymentService';
import Xendit from 'xendit-js-node';
import {nanoid} from "nanoid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(9),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  select: {
    padding: theme.spacing(2),
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function VaPayment() {
  const classes = useStyles();
  const paymentService = new PaymentService();
  paymentService.setMerchantId('dpay-merchant');
  paymentService.setApiKey('api-key-1234');

  const [checkoutDetails, setCheckoutDetails] = useState({
    amount: 0,
    bank: '',
    customerName: '',
  })

  const [vaNumber, setVaNumber] = useState("");
  const [externalId, setExternalId] = useState("");
  const [payment, setPayment] = useState({});


  Xendit.setPublishableKey("xnd_public_development_DZ2ivp4Fdg2ul8nWl2LTBGC4W6pczQAjsHVkgYCNCGzaizUikT5l6wnZ3JnK");

  const getOrderDto = () => {
    return {
      amount: parseInt(checkoutDetails.amount, 10),
      currency: 'IDR',
      customerId: "cust" + nanoid(21),
      customerFirstName: "string",
      customerLastName: "string",
      customerAddress: "string",
      customerCity: "string",
      customerPostalCode: "string",
      customerCountryCode: "string",
      customerEmail: "string",
      customerPhone: "string",
      billingFirstName: "string",
      billingLastName: "string",
      billingEmail: "string",
      billingPhone: "string",
      billingAddress: "string",
      billingCity: "string",
      billingPostalCode: "string",
      billingCountryCode: "string",
      shippingFirstName: "string",
      shippingLastName: "string",
      shippingEmail: "string",
      shippingPhone: "string",
      shippingAddress: "string",
      shippingCity: "string",
      shippingPostalCode: "string",
      shippingCountryCode: "string",
      completePaymentUrl: "string",
      errorPaymentUrl: "string",
    }
  }


  const handleAmountChange = (e) => {
    setCheckoutDetails({
      ...checkoutDetails,
      amount: e.target.value,
    })
  }

  const handleCustomerNameChange = (e) => {
    setCheckoutDetails({
      ...checkoutDetails,
      customerName: e.target.value,
    })
  }

  const pay = () => {
    paymentService.createOrder(getOrderDto()).then((order) => {
      paymentService.createPayment(getPaymentDto(order)).then((response) => {
        const downstream = JSON.parse(response.downstreamLastResponse)
        setPayment(response);
        setVaNumber(downstream.account_number);
        setExternalId(downstream.external_id);
        console.log(downstream);
      })
    });
  }

  const getPaymentDto = (order) => {
    return {
      orderId: order.id,
      timestamp: ~~(Date.now() / 1000),
      paymentMethod: 'VA_BCA',
    }
  }


  return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth className={classes.margin} variant="filled">
                <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
                <FilledInput
                  id="amount"
                  onChange={handleAmountChange}
                  startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField required id="customerName" label="Customer Name" onChange={handleCustomerNameChange} fullWidth autoComplete="cc-name" />
            </Grid>
            <Grid item xs={12} md={12}>
                <Select
                  labelId="select-bank-label"
                  id="select-bank"
                  inputProps={{ readOnly: true }}
                  native
                >
                  <option value="">Select Bank</option>
                  <option value="VA_BCA">BCA</option>
                </Select>
            </Grid>


            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={pay}>Pay Now</Button>
            </Grid>
          </Grid>
        </Paper>
        {vaNumber && (
          <Paper>
            <Typography variant="h4">
              VA Details
            </Typography>
            <hr/>
            <dl>
              <dt>VA Number</dt>
              <dd>{vaNumber}</dd>
              <dt>Payment ID</dt>
              <dd>{payment.id}</dd>
              <dt>External ID</dt>
              <dd>{externalId}</dd>
            </dl>
          </Paper>
        )}

      </main>
  )
}
