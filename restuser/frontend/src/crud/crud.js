import axios from "axios";
import {DataManager, JsonAdaptor, Query} from "@syncfusion/ej2-data";


const crud = {
    remote_url: "http://localhost:8000/books/",

    listBooks: async () => {
        let data = [];
        
        let res = (await axios.get(crud.remote_url));
        data = new DataManager({ json: res.data, adaptor: new JsonAdaptor })
            .executeLocal(new Query().take(res.data.length));   

        return data;
    },

    updateBooks: async (books) =>
    {
        let result = await axios.post(crud.remote_url, books);
        return result;
    }
};

export default crud;