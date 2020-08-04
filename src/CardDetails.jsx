import React, {useState} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
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


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
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

export default function CardDetails() {
  const classes = useStyles();
  const paymentService = new PaymentService();
  paymentService.setMerchantId('dpay-merchant');
  paymentService.setApiKey('api-key-1234');

  const [checkoutDetails, setCheckoutDetails] = useState({
    amount: 0,
    cardNumber: "",
    cardExpMonth: "",
    cardExpYear: "",
    cardCvc: "",
  })

  Xendit.setPublishableKey("xnd_public_development_DZ2ivp4Fdg2ul8nWl2LTBGC4W6pczQAjsHVkgYCNCGzaizUikT5l6wnZ3JnK");

  const pay = () => {
    paymentService.createOrder(getOrderDto()).then((order) => {
      tokenize((err, token) => {
        authenticate(token, (err, token, authData) => {
          console.log(authData);
          paymentHandler(order, token, authData);
        })
      })
    });

  }

  const tokenize = (callback) => {
    console.log(getTokenData());
    Xendit.card.createToken(getTokenData(), (err, token) => {
      if (err) {
        alert(JSON.stringify(err))
        callback(err, null);
        return;
      }
      callback(null, token)

    });
  }

  const authenticate = (token, callback) => {
    Xendit.card.createAuthentication(getAuthenticationData(token), (err, authData) => {
      if (err) {
        alert(JSON.stringify(err))
        return;
      }

      callback(err, token, authData);
    });
  }

  const paymentHandler = (order, token, auth) => {
    paymentService.createPayment(getPaymentDto(order, token, auth)).then((response) => alert(response.status));
  }


  const getAuthenticationData = (token) => {
    return {
      amount: checkoutDetails.amount,
      token_id: token.id,
    }
  }

  const getTokenData = () => {
    return {
      amount: checkoutDetails.amount,
      card_number: checkoutDetails.cardNumber,
      card_exp_month: checkoutDetails.cardExpMonth,
      card_exp_year: checkoutDetails.cardExpYear,
      is_multiple_use: true,
      should_authenticate: true,
    }
  }

  const getPaymentDto = (order, token, auth) => {
    return {
      orderId: order.id,
      timestamp: ~~(Date.now() / 1000),
      paymentMethod: 'CREDIT_CARD',
      cardTokenId: token.id,
      cardAuthId: auth.id,
    }
  }

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

  const handleCardNumberChange = (e) => {
    setCheckoutDetails({
      ...checkoutDetails,
      cardNumber: e.target.value,
    })
    console.log(checkoutDetails);
  }

  const handleCardNameChange = (e) => {
    setCheckoutDetails({
      ...checkoutDetails,
      cardName: e.target.value,
    })
  }

  const handleExpMonthChange = (e) => {
    setCheckoutDetails({
      ...checkoutDetails,
      cardExpMonth: e.target.value,
    })
  }

  const handleExpYearChange = (e) => {
    setCheckoutDetails({
      ...checkoutDetails,
      cardExpYear: e.target.value,
    })
  }


  const handleCvcChange = (e) => {
    setCheckoutDetails({
      ...checkoutDetails,
      cardCvc: e.target.value,
    })
  }

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Checkout
          </Typography>
        </Toolbar>
      </AppBar>
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
              <TextField required id="cardName" label="Name on card" onChange={handleCardNameChange} fullWidth autoComplete="cc-name" />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                required
                id="cardNumber"
                label="Card number"
                fullWidth
                autoComplete="cc-number"
                onChange={handleCardNumberChange}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField required id="expMonth" label="Expiry Month" onChange={handleExpMonthChange} fullWidth autoComplete="cc-exp" />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField required id="expYear" label="Expiry Year" onChange={handleExpYearChange} fullWidth autoComplete="cc-exp" />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                required
                id="cvv"
                label="CVV"
                fullWidth
                autoComplete="cc-csc"
                onChange={handleCvcChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={pay}>Pay Now</Button>
            </Grid>
          </Grid>
        </Paper>
      </main>
    </>
  )
}
