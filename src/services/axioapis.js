import { axiosNoAuthInstance } from "./axiosinstance";


const stockService = {
    getHistoricalData: (id) => {
        return axiosNoAuthInstance.get(`/api/company/${id}`)
        .then(res => res.data)
        .catch(err => {
            console.clear()
            throw err.response
            // console.clear()
        })
    }
}



export {stockService}
