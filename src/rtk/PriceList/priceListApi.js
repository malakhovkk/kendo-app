import axios from "axios";

export const priceListApi = {
    fetchData: (id) => {
        return axios.get(`http://${process.env.REACT_APP_IP}/api/Document/${id}`);
    }
}
