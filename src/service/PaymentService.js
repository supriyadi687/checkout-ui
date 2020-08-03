import axios from 'axios';

export class PaymentService {


    constructor() {
        this._baseUrl = "http://localhost:8000/api";
        this._client = axios.create({});
        this._merchantId = '';
        this._apiKey = '';
    }

    setMerchantId(merchantId) {
        this._merchantId = merchantId;
    }

    setApiKey(apiKey) {
        this._apiKey = apiKey;
    }

    createPayment(paymentDto) {
        return axios.post(this._baseUrl + '/payment', paymentDto, {
            auth: {
                username: this._merchantId,
                password: this._apiKey,
            }
        }).then((response) => response.data);;

    }

    createOrder(orderDto) {
        return axios.post(this._baseUrl + '/order', orderDto, {
            auth: {
                username: this._merchantId,
                password: this._apiKey,
            }
        }).then((response) => response.data);
    }
}
