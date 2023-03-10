import axios from "axios";
import jwtDecode from "jwt-decode";
import { useDispatch, useStore } from "react-redux";
import { setToken } from "../../../store/authSlice";
import { Chart } from "./Chart";

export default function Admin() {
  const store = useStore();
  let id = "0";
  const token = store.getState().auth.token;
  if(token){
    id = jwtDecode(token).id
  }
  //const id = jwtDecode(token).id;
  const dispatch = useDispatch();
    const fetchData = async () => {
      if (token) {
        try {
          const response = await axios.get(`/user/get/${id}`);
          //const user = response;
          //console.log(response);
        } catch (error) {
          if (error.response.status === 403) {
            //dispatch(logOut())
            dispatch(setToken(""));
          }
        }
      }
    };
    fetchData()
  return (
    <div className="mt-5">
      <h3 className="pt-5">hello admin</h3>
      <Chart/>
      
    </div>
  );
}
