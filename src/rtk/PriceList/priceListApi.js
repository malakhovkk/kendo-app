import axios from "axios";

export const priceListApi = {
    fetchData: () => {
        return axios.get(`http://${process.env.REACT_APP_IP}/api/`);
    }
}
