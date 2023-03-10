import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Label,
  Pagination,
  Spinner,
  Table,
  TextInput
} from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../store/authSlice";
import Swal from "sweetalert2";
import "./Activity.css";
import { toast } from "react-toastify";
export default function ListActivity() {
  const dispatch = useDispatch();
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setTypes] = useState("");
  const [activities, setActivities] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/activities/get/all`, {
        params: {
          page: currentPage,
          size: pageSize,
          sortBy: sort.sortBy,
          sortDir: sort.sortDir,
          searchTerm: searchTerm,
          status: status,
          startTime: startTime ? startTime : null,
          endTime: endTime ? endTime : null,
        },
      });
      setActivities(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [
    currentPage,
    dispatch,
    pageSize,
    sort,
    searchTerm,
    status,
    startTime,
    endTime,
  ]);
  const getType = useCallback(async () => {
    try {
      const { data } = await axios.get(`/activities/type/get/all`);
      setTypes(data);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch]);
  useEffect(() => {
    document.title = "Danh s??ch ho???t ?????ng";
    getType();
    fetchData();
  }, [fetchData, getType]);
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1);
    fetchData();
  };
  const handleSortChange = (sortBy, sortDir) => {
    setSort({ sortBy: sortBy, sortDir: sortDir });
    setCurrentPage(0);
    fetchData();
  };
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    fetchData();
  };
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };
  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };
  const handleRefresh = () => {
    setSearchTerm("");
    setSort({ sortBy: "id", sortDir: "ASC" });
    setPageSize(10);
    setCurrentPage(0);
    setStatus("");
    setStartTime("");
    setEndTime("");
  };
  const handleStatusChange = (a) => {
    setStatus(a);
    fetchData();
  };
  //xem chi ti???t
  const showFormInfo = (id) => {
    const item = activities.find((item) => item.id === id);
    Swal.fire({
      title: "Th??ng tin",
      html: `
        <table class="swal2-table">
          <tr>
            <td>T??n</td>
            <td>${item.name}</td>
          </tr>
          <tr>
            <td>M?? t???</td>
            <td>${item.description}</td>
          </tr>
          <tr>
            <td>?????a ??i???m</td>
            <td>${item.location}</td>
          </tr>
          <tr>
            <td>B???t ?????u</td>
            <td> ${
              new Date(item.startTime).toLocaleTimeString("en-GB") +
                " " +
                new Date(item.startTime).toLocaleDateString("en-GB") ?? ""
            }</td>
          </tr>
          <tr>
            <td>K???t th??c</td>
            <td> ${
              new Date(item.endTime).toLocaleTimeString("en-GB") +
                " " +
                new Date(item.endTime).toLocaleDateString("en-GB") ?? ""
            }</td>
          </tr>
          <tr>
            <td>Lo???i ho???t ?????ng</td>
            <td>${item.activityType.name}</td>
          </tr>
          <tr>
            <td>Gi??? t??ch l??y</td>
            <td>${item.accumulatedTime}</td>
          </tr>
          <tr>
            <td>Tr???ng th??i</td>
            <td>${item.status}</td>
          </tr>
        </table>
      `,
      confirmButtonText: "OK",
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  //th??m m???i
  const showFormCreate = async () => {
    await getType();
    const options = type
      .map((item) => `<option value="${item.name}">${item.name}</option>`)
      .join("");
    Swal.fire({
      title: "Th??m ho???t ?????ng",
      html: `
        <textarea type="text" id="name" class="swal2-textarea" style="height:50px;width:350px"
          placeholder="T??n ho???t ?????ng" tooltip="tooltip" title="T??n ho???t ?????ng"></textarea>
        <textarea type="text" id="description" class="swal2-textarea" style="height:50px;width:350px"
          placeholder="M?? t???" tooltip="tooltip" title="M?? t???"></textarea>
        <textarea type="text" id="location" class="swal2-textarea" style="height:50px;width:350px"
          placeholder="?????a ??i???m" tooltip="tooltip" title="?????a ??i???m"></textarea>
        <input type="datetime-local" id="startTime" class="swal2-input" tooltip="tooltip" title="B???t ?????u"
          style="width:350px" />
        <input type="datetime-local" id="endTime" class="swal2-input" tooltip="tooltip" title="K???t th??c"
          style="width:350px"/>
        <input type="number" id="accumulatedTime" class="swal2-input" tooltip="tooltip" title="Gi??? t??ch l??y"
          style="width:350px" placeholder="Gi??? t??ch l??y"/>
        <select id="activityType" class="swal2-input" tooltip="tooltip" title="Lo???i ho???t ?????ng"
          style="width:350px">
          ${options}
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector("#name").value;
        const description = Swal.getPopup().querySelector("#description").value;
        const location = Swal.getPopup().querySelector("#location").value;
        const startTime = Swal.getPopup().querySelector("#startTime").value;
        const endTime = Swal.getPopup().querySelector("#endTime").value;
        const accumulatedTime = Swal.getPopup().querySelector("#accumulatedTime").value;
        const activityType = Swal.getPopup().querySelector("#activityType").value;
        const now= new Date();
        const s= new Date(startTime);
        const e = new Date(endTime)
        console.log(s)
        if (!name || !location || !accumulatedTime) {
          Swal.showValidationMessage("Vui l??ng nh???p ????? th??ng tin");
          return false;
        }
        if (s < now) {
          Swal.showValidationMessage("Th???i gian b???t ?????u ph???i sau th???i ??i???m hi???n t???i");
          return false;
        }
  
        if (s >= e) {
          Swal.showValidationMessage("Th???i gian k???t th??c ph???i sau th???i gian b???t ?????u");
          return false;
        }
        const body = {
          name: name,
          description: description,
          location: location,
          startTime: startTime,
          endTime: endTime,
          accumulatedTime: accumulatedTime,
          activityType: activityType
        };
  
        return axios
          .post("/activities/create", body)
          .then((response) => {
            fetchData();
            handleSortChange("createdAt", "DESC");
            toast.success("Th??m th??nh c??ng");
          })
          .catch((error) => {
            console.log(error);
            toast.error("C?? l???i x???y ra khi th??m ho???t ?????ng")
          });
      },
    });
  };

  return activities === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <div className="flex justify-between items-center">
        <Label className="text-xl">Danh s??ch ho???t ?????ng</Label>
        <div className="flex items-center">
          <TextInput
            type="text"
            placeholder="T??m ki???m"
            value={searchTerm}
            onChange={handleInputChange}
            className="py-1 mr-2"
            style={{ height: "30px", width: "350px" }}
          />
          <Button
            className={activeClassname}
            style={{ height: "30px" }}
            onClick={() => handleSortChange("id", "ASC")}
          >
            T??m ki???m
          </Button>
        </div>
        <Button
          style={{ height: "30px" }}
          onClick={() => showFormCreate()}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="ml-2">Th??m</span>
        </Button>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex flex-wrap gap-2 ml-9">
          <Badge onClick={() => handleRefresh()} color="gray">
            Refresh
          </Badge>
          <Badge onClick={() =>  handleSortChange("createdAt", "DESC")} color="failure">
            Create
          </Badge>
          <Badge color="success">T???</Badge>
          <TextInput
            id="startTime"
            type="date"
            required={true}
            style={{ height: "21px", width: "125px" }}
            onChange={handleStartTimeChange}
            value={startTime}
          />
          <Badge color="success">?????n</Badge>
          <TextInput
            id="endTime"
            type="date"
            required={true}
            style={{ height: "21px", width: "125px" }}
            value={endTime}
            onChange={handleEndTimeChange}
          />
          <Dropdown
            label={pageSize}
            style={{ height: "21px", width: "50px" }}
            color="greenToBlue"
          >
            <Dropdown.Item onClick={() => handlePageSizeChange(5)}>
              5
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handlePageSizeChange(10)}>
              10
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handlePageSizeChange(15)}>
              15
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handlePageSizeChange(20)}>
              20
            </Dropdown.Item>
          </Dropdown>
          <Badge color="warning">Tr???ng th??i:</Badge>
          <Dropdown
            label={status === "" ? "T???t c???" : status}
            style={{ height: "21px", width: "150px" }}
            color="greenToBlue"
          >
            <Dropdown.Item onClick={() => handleStatusChange("")}>
              T???t c???
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("S???p di???n ra")}>
              S???p di???n ra
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("??ang di???n ra")}>
              ??ang di???n ra
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("???? di???n ra")}>
              ???? di???n ra
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      <Table hoverable={true}>
        <Table.Head className={activeClassname}>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("name", "ASC")}>
            T??n ho???t ?????ng
          </Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("startTime", "ASC")}>
            T???
          </Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("endTime", "ASC")}>
            ?????n
          </Table.HeadCell>
          <Table.HeadCell>Tr???ng th??i</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {activities.map((item, index) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={item.id}
            >
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell
                onClick={() => showFormInfo(item.id)}
                className="whitespace-normal font-medium text-gray-900 dark:text-white"
              >
                {item.name}
              </Table.Cell>
              <Table.Cell
                onClick={() => showFormInfo(item.id)}
                className="whitespace-normal font-medium text-gray-900 dark:text-white"
              >
                {new Date(item.startTime).toLocaleTimeString("en-GB") +
                  " " +
                  new Date(item.startTime).toLocaleDateString("en-GB") ?? ""}
              </Table.Cell>
              <Table.Cell
                onClick={() => showFormInfo(item.id)}
                className="whitespace-normal font-medium text-gray-900 dark:text-white"
              >
                {new Date(item.endTime).toLocaleTimeString("en-GB") +
                  " " +
                  new Date(item.endTime).toLocaleDateString("en-GB") ?? ""}
              </Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                <Badge
                  color={
                    {
                      "S???p di???n ra": "warning",
                      "??ang di???n ra": "success",
                      "???? k???t th??c": "failure",
                    }[item.status]
                  }
                  className="flex justify-center"
                >
                  {item.status}
                </Badge>
              </Table.Cell>

              <Table.Cell className="whitespace-normal text-gray-900 dark:text-white">
                <div className="flex justify-end">
                  <Button
                    style={{ height: "30px", width: "30px" }}
                    //onClick={() => showFormEdit(item.id)}
                    className="mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    style={{ height: "30px", width: "30px" }}
                    //onClick={() => handleDelete(item.id)}
                    className="bg-gradient-to-r from-pink-400 to-orange-500 text-white font-bold py-1 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        className="flex justify-center "
        currentPage={currentPage + 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Card>
  );
}
