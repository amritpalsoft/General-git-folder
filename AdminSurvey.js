import React, { Component } from "react";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import ReviewerCloseIcon from '../../assets/images/reviewerCloseIcon.svg';
import DeletePopup from '../../components/AlertDialog/DeletePopup';
import SurveyPopup from '../../components/AlertDialog/SurveyResultPopup';
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button'
import $ from "jquery";
import { Api } from './../../api/Api';
import GetAPIHeader from './../../api/ApiCaller';
import ErrorHandling from './../../api/ErrorHandling';
import Loading from '../../components/Loading/loading';
import Empty from "../../components/Utils/Empty/Empty";
import Pagination from "react-js-pagination";
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { getMonthNameWithDate, LocalDateTime, LocalDateTimeFormat } from '../../constants/constants';
import Select from 'react-select';
import StorageUtils from '../../containers/utils/StorageUtils';
import FilledDatePicker from '../../components/FilledDatePicker/FilledDatePicker';
import OptionsIconBlue from "../../assets/images/optionsIconBlue.svg";
import Modal from 'react-bootstrap/Modal';
import { addDay,addHours } from "../../constants/constants";
import moment from 'moment';
import RangeSlider from 'react-range-slider-input';
import emptyNotification from "../../assets/images/empty/notifications.svg";
import { filter } from "lodash";
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

import './surveyStyles.scss'
var ExcelReport = require('../../components/ExcelReport/ExcelReport');

const Storage = new StorageUtils();

const QuestStatus = {
    Deleted: "0",
    Active: "1",
    Inactive: "2",
    Expired: "3"
}
const customStyles = {
    control: provided => ({
        ...provided,
        padding: 6,
        margin: 0,
        marginLeft: 0,
        fontSize: 14,
        backgroundColor: 'white',
        outline: 'none',
        cursor: 'pointer',
        pointVal: 0,
        selectedBadge: '',
        selectedBadgeKey: ''
    })
};

const mycustomStyles = {
    control: provided => ({
        ...provided,
        width: 155,
        height: 6,
        border: '0 !important',
        boxShadow: '0 !important',
        '&:hover': {
            border: '0 !important'
        },
        border: "none",
        padding: -5,
        paddingLeft: 12,
        "@media only screen and (max-width: 540px)": {

            paddingLeft: 67,
            minHeight: 52,
            lineHeight: "-1px",
            paddingTop: 35,
            marginTop: -26
        },
        paddingRight: 0,
        margin: 0,
        marginLeft: 0,
        fontSize: 12,
        backgroundColor: 'none',
        outline: 'none',
        cursor: 'pointer',
        pointVal: 0,
        selectedBadge: '',
        selectedBadgeKey: ''
    })
};

class AdminSurvey extends Component {
    constructor(props) {
        super(props);
        const { t } = this.props
        this.manageColumnCheck = React.createRef();
        const format = "DD-MMM-YYYY hh:mm A";

        let currentDatetime = LocalDateTime(new Date())
    let futureDatetime = LocalDateTime( addDay(new Date(), -7))
        this.state = {
            checked: true,
            placeholder: `${t("quest.search")}`,
            selectedType: { label: `${t("quest.questtitle")}`, value: `${t("quest.questtitle")}` },
            tableHeader: this.tableInitialState(),
            pageNumber: 1,
            dueDateStart:"",
            dueDateEnd:"",
            sentDateStart:"",
            sentDateEnd:"",
            pageSize: 10,
            totalPages: 0,
            questType: true,
            groupChecked: false,
            showDeletePopup: false,
            showChangeGroupPopup: false,
            updating: false,
            adminQuestList: [],
            loading: 0,
            questLoading: false,
            disableEditDel: true,
            editableData: [],
            deleteQuestData: [],
            changeGroupQuestData: [],
            notFilterdData: [],
            surveyTitle: "Descending",
            publishedDate: "Descending",
            surveyDueDate: "Descending",
            surveyResponse: "Descending",
            updatedDateSorting: "Descending",
            endDateSorting: "Descending",
            statusSorting: "Descending",
            filterName: "",
            searchByName:"",
            filteredList: [],
            tableLoader: 0,
            searchList: false,
            ActiveStatus: false,
            InActiveStatus: false,
            ExpiredStatus: false,
            sortName: '',
            sortType: '',
            individualChecked: false,
            everyoneChecked: false,
            selectedUnitAPI: [],
            selectedUnitCategoryAPI: [], 
            filterUnitCats: [],
            unitCategoryLoading: 1,
            DisplaySelectedUnitCategory: [],
            filterUnits: [],
            searchBy: 1,
            unitLoading: 1,
            selectedUnitFilters: [],
            DisplaySelectedUnits: [],
            displayUnitFilter: true,
            filterCats: [],
            filterGroupCats: [],
            filterSubGroupCats: [],
            CategoryLoading: 1,
            GroupCategoryLoading: 1,
            SubGroupCategoryLoading: 1,
            selectedCatFilters: [],
            selectedGroupCatFilters: [],
            selectedSubGroupCatFilters: [],
            filterStatus: [
                { label: "All", value: "All" },
                { Status: "OPEN", Id: 1, label: "Open", value: "1" },
                { Status: "INPROGRESS", Id: 2, label: "Inprogress", value: "2" },
                { Status: "COMPLETED", Id: 2, label: "Completed", value: "3" },
                { Status: "CANCELLED", Id: 2, label: "Cancelled", value: "4" },
                { Status: "EXPIRED", Id: 3, label: "Expired", value: "5" }
            ],
            selectedStatusFilters: [],
            selectedStatusFilters2: [],
            showDatePicker: false,
            confirmationPopup: false,
            updatingEndDate: false,
            questNameFlag: true,
            createdByFlag: true,
            unitCategoryFlag: false,
            unitFlag: true,
            questTypeFlag: true,
            createdDateFlag: true,
            updatedDateFlag: false,
            endDateFlag: true,
            manageColumnFlag: false,
            maxColumnLimit: 4,
            currentColumnLimit: 2,
            openResponsePopup:false,
            responseRateFrom:0,
            responseRateTo:100
        };
        this.keyPress = this.keyPress.bind(this);
        this.keyPress2 = this.keyPress2.bind(this);
    }

    componentDidMount() {
        const{sentDateEnd, sentDateStart, dueDateStart, dueDateEnd} = this.state
        this.getSurveyAdminList(1)
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.addEventListener('click', this.handleClickOutside, true);
        localStorage.setItem("myTab", "#quest")
    }

    clearPreviousState() {
        this.clearManageColumnState();
        this.setState({
            DisplaySelectedUnitCategory: [],
            DisplaySelectedUnits: [],
            selectedUnitFilters: [],
            individualChecked: false,
            everyoneChecked: false,
            displayUnitFilter: true,
            selectedCatFilters: [],
            selectedGroupCatFilters: [],
            selectedSubGroupCatFilters: [],
            selectedStatusFilters: [],
            loading: 1,
            adminQuestList: [],
            filterName: "",
            searchByName:"",
            searchList: false,
            surveyTitle: "Descending",
            surveyDueDate: "Descending",
            createdByName: "Descending",
            publishedDate: "Descending",
            surveyDueDate: "Descending",
            surveyResponse: "Descending",
            updatedDateSorting: "Descending",
            statusSorting: "Descending",
            endDateSorting: "Descending",
        }, () => {
            
                this.onSurveyTabClick()
            });
    }

    tableInitialState() {
        const { t } = this.props
        return [
            {
                title: `${t("survey.surveyTitle")}`,
                width: "14%",
                orderable: true,
                defaultOrderable: true,
                orderType: "",
                manageColumnEnable: true,
                id: "surveyNameFlag",
                visibleHeader: true,
            },
            {
                title: `${t("survey.surveyDescription")}`,
                width: "25%",
                orderable: true,
                defaultOrderable: true,
                orderType: "",
                manageColumnEnable: false,
                id: "surveyDueDateFlag",
                visibleHeader: true,
            },
            {
                title: `${t("survey.createdBy")}`,
                width: "14%",
                orderable: true,
                defaultOrderable: true,
                orderType: "",
                manageColumnEnable: false,
                id: "createdByFlag",
                visibleHeader: true,
            },
            
            
            {
                title: `${t("survey.sentOn")}`,
                width: "13%",
                class: "pl-0",
                orderable: true,
                defaultOrderable: true,
                orderType: "Descending",
                manageColumnEnable: true,
                id: "createdDateFlag",
                visibleHeader: true,
            },
            {
                title: `${t("survey.dueDate")}`,
                width: "13%",
                class: "pl-0",
                orderable: true,
                defaultOrderable: true,
                orderType: "",
                manageColumnEnable: false,
                id: "dueDateFlag",
                visibleHeader: true,
            },
            {
                title: `${t("survey.response")}`,
                width: "10%",
                class: "pl-0",
                orderable: true,
                defaultOrderable: true,
                orderType: "",
                manageColumnEnable: true,
                id: "responseFlag",
                visibleHeader: true,
            },
            {
                title: `${t("quest.status")}`,
                width: "10%",
                class: "text-center",
                orderable: true,
                defaultOrderable: true,
                orderType: "",
                visibleHeader: true,
            },
            
        ]
    }

    clearManageColumnState() {
        this.setState({
            questNameFlag: true,
            createdByFlag: true,
            unitCategoryFlag: false,
            unitFlag: true,
            questTypeFlag: true,
            createdDateFlag: true,
            updatedDateFlag: false,
            endDateFlag: true,
            manageColumnFlag: false,
            currentColumnLimit: 2,
            tableHeader: this.tableInitialState(),
        })
    }

    sortDataTable = (e) => {
        const { searchFlag ,sentDateStart,sentDateEnd,dueDateStart,dueDateEnd,responseRateFrom,responseRateTo,searchByName} = this.state;
        if (e.target.id == ("Survey title")) {
            this.setState({
                searchList: false
            });
            let sort;
            if (this.state.surveyTitle == "Descending") {
                sort = "Ascending";
                this.setState({
                    sortSelected: "surveyTitle", seltectedSortType: "Ascending", surveyTitle: "Ascending",
                    surveyDueDate: "Descending", surveyResponse: "Descending", updatedDateSorting: "Descending", publishedDate: "Descending",
                    statusSorting: "Descending", sortName: 'surveyTitle', sortType: 'Ascending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Survey title" ? { ...eachItem, orderType: sort } : eachItem
                    )
                })
                );
            } else {
                sort = "Descending";
                this.setState({
                    sortSelected: "surveyTitle", seltectedSortType: "Descending", surveyTitle: "Descending",
                    surveyDueDate: "Descending", surveyResponse: "Descending", updatedDateSorting: "Descending", publishedDate: "Descending",
                    statusSorting: "Descending", sortName: 'surveyTitle', sortType: 'Descending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Survey title" ? { ...eachItem, orderType: sort } : eachItem
                    )
                })
                );
            }
            this.setState(prevState => ({
                tableHeader: prevState.tableHeader.map(eachItem => eachItem.title !== "Survey title" ? { ...eachItem, orderType: "" } : eachItem
                )
            })
            );

            this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, this.state.selectedStatusFilters, this.state.filterName, "surveyTitle", sort,responseRateFrom,responseRateTo,searchByName, searchFlag)


        }
        if (e.target.id == ("Survey description")) {
            this.setState({
                searchList: false
            });
            let sort;
            if (this.state.surveyDueDate == "Descending") {
                sort = "Ascending";
                this.setState({
                    sortSelected: "title", seltectedSortType: "Ascending", surveyDueDate: "Ascending", createdByName: "Descending",
                    surveyDueDate: "Descending", surveyResponse: "Descending", updatedDateSorting: "Descending", publishedDate: "Descending",
                    statusSorting: "Descending", sortName: 'title', sortType: 'Ascending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Survey description" ? { ...eachItem, orderType: sort } : eachItem),
                    })
                );
            } else {
                sort = "Descending";
                this.setState({
                    sortSelected: "title", seltectedSortType: "Descending", surveyDueDate: "Descending", createdByName: "Descending",
                    surveyDueDate: "Descending", surveyResponse: "Descending", updatedDateSorting: "Descending", publishedDate: "Descending",
                    statusSorting: "Descending", sortName: 'title', sortType: 'Descending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Survey description" ? { ...eachItem, orderType: sort } : eachItem),
                    })
                );
            }
            this.setState(prevState => ({
                tableHeader: prevState.tableHeader.map(eachItem => eachItem.title !== "Survey description" ? { ...eachItem, orderType: "" } : eachItem),
                })
            );
            this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, this.state.selectedStatusFilters, this.state.filterName, "title", sort, responseRateFrom,responseRateTo,searchByName, searchFlag)


        }

        if (e.target.id == ("Created by")) {
            this.setState({
                searchList: false
            });
            let sort;
            if (this.state.createdByName == "Descending") {
                sort = "Ascending";
                this.setState({
                    sortSelected: "createByName", seltectedSortType: "Ascending", createdByName: "Ascending", surveyDueDate: "Descending",
                    surveyDueDate: "Descending", surveyResponse: "Descending", updatedDateSorting: "Descending", publishedDate: "Descending",
                    statusSorting: "Descending", sortName: 'createByName', sortType: 'Ascending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Created by" ? { ...eachItem, orderType: sort } : eachItem),
                    })
                );
            } else {
                sort = "Descending";
                this.setState({
                    sortSelected: "createByName", seltectedSortType: "Descending", createdByName: "Descending", surveyDueDate: "Descending",
                    surveyDueDate: "Descending", surveyResponse: "Descending", updatedDateSorting: "Descending", publishedDate: "Descending",
                    statusSorting: "Descending", sortName: 'createByName', sortType: 'Descending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Created by" ? { ...eachItem, orderType: sort } : eachItem),
                    })
                );
            }
            this.setState(prevState => ({
                tableHeader: prevState.tableHeader.map(eachItem => eachItem.title !== "Created by" ? { ...eachItem, orderType: "" } : eachItem),
                })
            );
            this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, this.state.selectedStatusFilters, this.state.filterName, "createByName", sort,responseRateFrom,responseRateTo,searchByName, searchFlag)


        }

        if (e.target.id == "Published date") {
            this.setState({
                searchList: false
            });
            let sort;
            if (this.state.publishedDate == "Descending") {
                sort = "Ascending";
                this.setState({
                    sortSelected: "createDate", seltectedSortType: "Ascending", publishedDate: "Ascending",
                    surveyTitle: "Descending", surveyDueDate: "Descending", surveyResponse: "Descending", updatedDateSorting: "Descending", endDateSorting: "Descending",
                    statusSorting: "Descending", sortName: 'createDate', sortType: 'Ascending'
                });
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Published date" ? { ...eachItem, orderType: sort } : eachItem),
                    })
                );
            } else {
                sort = "Descending";
                this.setState({
                    sortSelected: "createDate", seltectedSortType: "Descending", publishedDate: "Descending",
                    surveyTitle: "Descending", surveyDueDate: "Descending", surveyResponse: "Descending", updatedDateSorting: "Descending", endDateSorting: "Descending",
                    statusSorting: "Descending", sortName: 'createDate', sortType: 'Descending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Published date" ? { ...eachItem, orderType: sort } : eachItem),
                    })
                );
            }
            this.setState(prevState => ({
                tableHeader: prevState.tableHeader.map(eachItem => eachItem.title !== "Published date" ? { ...eachItem, orderType: "" } : eachItem),
                })
            );

            this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, this.state.selectedStatusFilters, this.state.filterName, "createDate", sort,responseRateFrom,responseRateTo,searchByName)

        }
        if (e.target.id == "Due date") {
            this.setState({
                searchList: false
            });
            let sort;
            if (this.state.surveyDueDate == "Descending") {
                sort = "Ascending";
                this.setState({
                    sortSelected: "dateTo", seltectedSortType: "Ascending", surveyDueDate: "Ascending", publishedDate: "Descending",
                    surveyTitle: "Descending", surveyResponse: "Descending", updatedDateSorting: "Descending", endDateSorting: "Descending",
                    statusSorting: "Descending", sortName: 'dateTo', sortType: 'Ascending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Due date" ? { ...eachItem, orderType: sort } : eachItem
                    )
                })
                );
            } else {
                sort = "Descending";
                this.setState({
                    sortSelected: "dateTo", seltectedSortType: "Descending", surveyDueDate: "Descending", publishedDate: "Descending",
                    surveyTitle: "Descending", surveyResponse: "Descending", updatedDateSorting: "Descending", endDateSorting: "Descending",
                    statusSorting: "Descending", sortName: 'dateTo', sortType: 'Descending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Due date" ? { ...eachItem, orderType: sort } : eachItem
                    )
                })
                );
            }
            this.setState(prevState => ({
                tableHeader: prevState.tableHeader.map(eachItem => eachItem.title !== "Due date" ? { ...eachItem, orderType: "" } : eachItem
                )
            })
            );
            this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, this.state.selectedStatusFilters, this.state.filterName, "dateTo", sort,responseRateFrom,responseRateTo,searchByName)
        }
        if (e.target.id == "Response") {
            this.setState({
                searchList: false
            });
            let sort;
            if (this.state.surveyResponse == "Descending") {
                sort = "Ascending";
                this.setState({
                    sortSelected: "responseRate", seltectedSortType: "Ascending", surveyResponse: "Ascending", publishedDate: "Descending",
                    surveyTitle: "Descending", surveyDueDate: "Descending", updatedDateSorting: "Descending", endDateSorting: "Descending",
                    statusSorting: "Descending", sortName: 'responseRate', sortType: 'Ascending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Response" ? { ...eachItem, orderType: sort } : eachItem),
                    })
                );
            } else {
                sort = "Descending";
                this.setState({
                    sortSelected: "responseRate", seltectedSortType: "Descending", surveyResponse: "Descending", publishedDate: "Descending",
                    surveyTitle: "Descending", surveyDueDate: "Descending", updatedDateSorting: "Descending", endDateSorting: "Descending",
                    statusSorting: "Descending", sortName: 'responseRate', sortType: 'Descending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Response" ? { ...eachItem, orderType: sort } : eachItem),
                    })
                );
            }
            this.setState(prevState => ({
                tableHeader: prevState.tableHeader.map(eachItem => eachItem.title !== "Response" ? { ...eachItem, orderType: "" } : eachItem),
                })
            );
            this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, this.state.selectedStatusFilters, this.state.filterName, "responseRate", sort,responseRateFrom,responseRateTo,searchByName)
        }
        if (e.target.id == "Status") {
            this.setState({
                searchList: false
            });
            let sort;
            if (this.state.statusSorting == "Descending") {
                sort = "Ascending";
                this.setState({
                    sortSelected: "sendSurveyStatusDesc", seltectedSortType: "Ascending", statusSorting: "Ascending", publishedDate: "Descending",
                    surveyTitle: "Descending", surveyDueDate: "Descending", surveyResponse: "Descending",
                    updatedDateSorting: "Descending", sortName: 'sendSurveyStatusDesc', sortType: 'Ascending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Status" ? { ...eachItem, orderType: sort } : eachItem),
                    })
                );
            } else {
                sort = "Descending";
                this.setState({
                    sortSelected: "sendSurveyStatusDesc", seltectedSortType: "Descending", statusSorting: "Descending", publishedDate: "Descending",
                    surveyTitle: "Descending", surveyDueDate: "Descending", surveyResponse: "Descending",
                    updatedDateSorting: "Descending", sortName: 'sendSurveyStatusDesc', sortType: 'Descending'
                })
                this.setState(prevState => ({
                    tableHeader: prevState.tableHeader.map(eachItem => eachItem.title == "Status" ? { ...eachItem, orderType: sort } : eachItem),
                    })
                );
            }
            this.setState(prevState => ({
                tableHeader: prevState.tableHeader.map(eachItem => eachItem.title !== "Status" ? { ...eachItem, orderType: "" } : eachItem),
                })
            );
            this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, this.state.selectedStatusFilters, this.state.filterName, "sendSurveyStatusDesc", sort,responseRateFrom,responseRateTo,searchByName)
        }

    }

    closeDeleteModal() {
        this.setState({ showDeletePopup: false });
    }

    deletePopupClick() {
        let itemCopy = this.state.deleteQuestData;
        console.log('item', itemCopy);
        itemCopy.StatusId = QuestStatus.Deleted;
        this.DeleteSurvey(itemCopy.sguid);
    }

    DeleteSurvey(questItem) {
        const { pageNumber, responseRateFrom,responseRateTo,sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters, filterName } = this.state;
        this.setState({
            loading: 1
        });
        const { t } = this.props;
        new Api(GetAPIHeader(Storage.getAccessToken())).v31.sendSurveyCancel(questItem, { reason: 'yes' })
            .then(response => {
                this.setState({ showDeletePopup: false, loading: 0 });
                ToastsStore.success(t('survey.surveyCanceldSuccess'));
                this.getSurveyAdminList(pageNumber, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters, filterName);
            }).catch((errorResponse) => {
                this.setState({
                    loading: 0
                });
                this.setState({ showDeletePopup: false });
                ToastsStore.warning(errorResponse.Message);
            });
    }
    
    renderDeletePopUp() {
        let desc=`Are you sure you want to cancel the ${this.state.descriptionSurvey}`
        return (
            <DeletePopup
                label={"Cancel the survey"}
                description={desc}
                show={this.state.showDeletePopup}
                closeModal={this.closeDeleteModal.bind(this)}
                callback={this.deletePopupClick.bind(this)}
            />
        );
    }

    getSurveyAdminList(pageNumber, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters, filterName, sortName, sortType,responseRateFrom,responseRateTo,searchByName, searchFlag) {
        var value2 = this.state.selectedType.value;
        this.setState({})
        if (searchFlag) {
            this.setState({
                tableLoader: 1,
                adminQuestList: [],
            });
        } else {
            this.setState({
                loading: 1,
                adminQuestList: []
            });
        }
        let sortObj = sortName ? {
            ...(sortName && sortName == "Name" && { "Name": sortType }),
            ...(sortName && sortName == "GroupCategory" && { "GroupCategory": sortType }),
            ...(sortName && sortName == "SubGroupCategory" && { "SubGroupCategory": sortType }),
            ...(sortName && sortName == "CategoryName" && { "CategoryName": sortType }),
            ...(sortName && sortName == "CreatedDate" && { "CreatedDate": sortType }),
            ...(sortName && sortName == "UpdatedDate" && { "UpdatedDate": sortType }),
            ...(sortName && sortName == "Status" && { "Status": sortType }),
            ...(sortName && sortName == "EndDate" && { "EndDate": sortType }),
            ...(sortName && sortName == "CreatorName" && { "CreatorName": sortType })
        } : { "CreatedDate": "Descending" };
        
           let questRequestJson={
                "sendSurveyParam.title":filterName,
                "sendSurveyParam.description": filterName,
                "sendSurveyParam.senddatefrom": sentDateStart,
                "sendSurveyParam.senddateto": sentDateEnd,
                "sendSurveyParam.duedatefrom": dueDateStart,
                "sendSurveyParam.duedateto": dueDateEnd,
                "sendSurveyParam.createby": searchByName,
                "sendSurveyParam.modifiedby": "",
                "sendSurveyParam.surveyeename": "",
                "sendSurveyParam.responseratefrom":responseRateFrom,
                "sendSurveyParam.responserateto": responseRateTo,
                "sendSurveyParam.status": selectedStatusFilters,
                "sendSurveyParam.sort": sortName,
                "sendSurveyParam.sortorder": sortType,
                "sendSurveyParam.page": pageNumber,
                "sendSurveyParam.pagesize": 10,
              }
        
        new Api(GetAPIHeader(Storage.getAccessToken())).v31.sendSurveyGet(questRequestJson)
            .then(response => {
                this.setState({ loading: 0, tableLoader: 0, pageNumber: response.PageNumber });
                if(response.Results.length>0){
                    this.setState({adminQuestList:response.Results,totalPages:response.TotalRecords})
                }else{
                    this.setState({totalPages:response.TotalRecords})
                }
                
            }).catch((err) => {
                ErrorHandling(err)
                this.setState({
                    loading: 0,
                    tableLoader: 0,
                });
            });
    }

    handlePageChange(selectedPage) {
        this.setState({ loading: true })
        const { sentDateStart,responseRateFrom,responseRateTo,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters, filterName, sortName, sortType, searchList,searchByName } = this.state;
        this.setState({ pageNumber: selectedPage, tableLoader: 1 });
        if (searchList) {
            this.setState({ searchList: searchList });
        }
        this.getSurveyAdminList(selectedPage, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters, filterName, sortName, sortType,responseRateFrom,responseRateTo,searchByName, true)
    }

    checkDisable(itemStatusId, menu) {
        if (menu == "EditMenu" && (QuestStatus.Active == itemStatusId || QuestStatus.Expired == itemStatusId)) {
            return true;
        } else if (menu == "Options" && QuestStatus.Active == itemStatusId) {
            return true;
        } else {
            return false;
        }
    }
    disableDueDate(statusId) {
        return QuestStatus.Expired == statusId || QuestStatus.Inactive == statusId;
    }
    
    statusOnChange(event) {
        console.log('event',event);
        this.setState({
            searchList: true
        });
        let StatusFilters = [];
        const { filterName, responseRateFrom,responseRateTo,sortName, sortType,sentDateStart,sentDateEnd,dueDateStart,dueDateEnd,searchByName, selectedUnitFilters, selectedCatFilters, selectedGroupCatFilters, selectedSubGroupCatFilters, selectedStatusFilters,selectedStatusFilters2 } = this.state;
        if (event && event != null && event != "" && event != undefined) {
            StatusFilters = event.Status;
            this.setState({ selectedStatusFilters: event.Status , selectedStatusFilters2:event});
        }


        this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, StatusFilters, filterName, sortName, sortType,responseRateFrom,responseRateTo,searchByName, true);
    }

   

    renderSortIcon = (orderType) => {
        let iconStyle;
        if (orderType === "Ascending") {
            iconStyle = "-up";
        } else if (orderType === "Descending") {
            iconStyle = "-down";
        } else {
            iconStyle = "";
        }
        return iconStyle;
    }

    renderQuest() {
        const { t } = this.props;
        const { tableHeader, adminQuestList,createdByFlag, loading, createdDateFlag, updatedDateFlag, endDateFlag } = this.state;
        return (
            loading ?
                <Loading /> :
                <div className="table table-responsive-md" style={{ width: '100%', overflow: 'auto' }}>
                    <table
                        className="table table-borderless dt container-fluid p-0"
                        id="questTable"
                        style={{ fontSize: "14px", border: "0" }}
                    >
                        <thead>
                            <tr>
                                {tableHeader &&
                                    tableHeader.length > 0 &&
                                    tableHeader.map((item, index) => {
                                        if (item.visibleHeader) {
                                            return (
                                                <th scope="col" key={index} style={{ border: 0 }} className={item.class} style={{ width: item.width }}>
                                                    <div className="d-flex align-items-center">
                                                        <span className="pl-1 pr-2">{item.title}</span>
                                                        {item.orderable &&
                                                            <i className={"fa fa-sort" + this.renderSortIcon(item.orderType) + " pointer"}
                                                                aria-hidden="true"
                                                                // id={`header_sort${index+1}`} 
                                                                id={item.title}
                                                                style={item.orderType.length > 0 ? { opacity: "1" } : { opacity: "0.3" }}
                                                                onClick={(e) => this.sortDataTable(e)}></i>
                                                        }
                                                    </div>
                                                </th>
                                            );
                                        }
                                    })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tableLoader ? <Loading Height="0" /> :
                                adminQuestList &&
                                    adminQuestList.length > 0 ?
                                    adminQuestList.map((item, index) => {
                                        let displayArr = [];
                                        return (
                                            <tr className="bg-white" key={index}>
                                                {<td className="px-1 py-2 pl-3 pr-1 table-text-size font-weight-light">
                                                    <p
                                                        className="multi-line-truncate break-word"
                                                        style={{ WebkitLineClamp: 2 }} data-toggle="tooltip" data-placement="top" title={item.surveyTitle}
                                                    >
                                                        {item.surveyTitle}
                                                    </p>
                                                </td>}
                                                {<td className="px-1 py-2 pl-3 pr-1 table-text-size font-weight-light">
                                                    <p
                                                        className="multi-line-truncate break-word"
                                                        style={{ WebkitLineClamp: 2 }} data-toggle="tooltip" data-placement="top" title={item.title}
                                                    >
                                                        {item.title}

                                                    </p>
                                                </td>}
                                                
                                                {<td className="px-1 py-2 pl-3 pr-1 table-text-size font-weight-light">
                                                    <p
                                                        className="multi-line-truncate break-word"
                                                        style={{ WebkitLineClamp: 2 }} data-toggle="tooltip" data-placement="top" title={item.createByName}
                                                    >
                                                        {item.createByName}

                                                    </p>
                                                </td>}
                                               
                                                { <td className="px-1 py-2 pr-1 table-text-size font-weight-light">
                                                    <p>{moment(LocalDateTime(item.createDate)).format("DD MMM YYYY")}</p>
                                                </td>}
                                                
                                                {<td className="px-1 py-2 pr-1 table-text-size font-weight-light">
                                                    <p>{moment(LocalDateTime(item.dateTo)).format("DD MMM YYYY")}</p>
                                                </td>}
                                               
                                                {<td className="px-1 py-2 pr-1 table-text-size font-weight-light">
                                                    <p
                                                        className="multi-line-truncate break-word"
                                                        style={{ WebkitLineClamp: 2 }} data-toggle="tooltip" data-placement="top" title={item.responseRate}
                                                    >
                                                        {`${item.responseRate}%`}
                                                    </p>
                                                </td>}
                                                
                                                {<td className="px-1 py-2 pl-3 pr-1 table-text-size font-weight-light">
                                                    <p
                                                        className="multi-line-truncate break-word"
                                                        style={{ WebkitLineClamp: 2 }} data-toggle="tooltip" data-placement="top" title={`${(item.sendSurveyStatusCode.charAt(0))}${(item.sendSurveyStatusCode.slice(1)).toLowerCase()}`}
                                                    >
                                                        {`${(item.sendSurveyStatusCode.charAt(0))}${(item.sendSurveyStatusCode.slice(1)).toLowerCase()}`}
                                                    </p>
                                                </td>}
                                    
                                                <td className="px-1 py-2 pl-2 table-text-size text-center">
                                                    {
                                                        <div className="iconDiv">
                                                             {this.renderActionOptions(item)}
                                                        </div>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr className="bg-white">
                                        <td colSpan="8" className="dataTables_empty">
                                            No Records Found.
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
        );
    }

    handleClickOutside = (event) => {
        if (((event.target && event.target.id) !== (this.manageColumnCheck.current && this.manageColumnCheck.current.id))
            && ((event.target && event.target.parentElement && event.target.parentElement.previousElementSibling && event.target.parentElement.previousElementSibling.id) !== (this.manageColumnCheck.current && this.manageColumnCheck.current.id))
        ) {
            this.setState({ manageColumnFlag: false })
        }
    }

    openResponsePopup(item){
        console.log('item',item);
        this.setState({openResponsePopup:true,data:item})
    }

    closeResponsePopup(){
        this.setState({openResponsePopup:false})
    }

    renderResponsePopup(){
        console.log('rendered');
        return(
            <SurveyPopup data={this.state.data}
            closePopup={this.closeResponsePopup.bind(this)}
            show={this.state.openResponsePopup}/>
        )
    }

    onExportClick=(item)=>{
        new Api(GetAPIHeader(Storage.getAccessToken())).v31.surveyResultGetXls(item.sguid)
            .then(response => {
                ExcelReport.exportToExcelReport("Individual", response);
                // this.setState({ loading: 0 })
            }).catch((err) => {
                // this.setState({ loading: 0 });
            });

    }

    renderActionOptions(item) {
        const { t } = this.props;
        console.log("item",item);
        return (
            <>
                <input
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    type="image"
                    src={OptionsIconBlue}
                    alt="Options"
                />
                <div className="dropdown-menu">
                    {<p className="dropdown-item pointer" onClick={() => this.openResponsePopup(item)}>
                        {t('survey.viewResponse')}
                    </p>}
                    {<p className={item.responseRate==0 ? "dropdown-item disabled-quest admin_disable" : "dropdown-item pointer"} onClick={() => this.onExportClick(item)}>
                        {t('survey.exportResult')}
                    </p>}
                    { <p className={item.sendSurveyStatusCode==="CANCELLED" ?"dropdown-item disabled-quest admin_disable" : "dropdown-item pointer"}
                        onClick={() => this.onShowDatePicker(item)}>

                        {t('survey.changeDueDate')}
                    </p>}
                    {<p className={item.sendSurveyStatusCode==="CANCELLED" ?"dropdown-item disabled-quest admin_disable" :"dropdown-item pointer"}
                        onClick={() => this.setState({ showDeletePopup: true, deleteQuestData: item, descriptionSurvey:item.surveyTitle })}>

                        {t('common.cancel')}
                    </p>}
                </div>
            </>
        )
    }

    keyPress(e) {
        const {searchByName,responseRateFrom,responseRateTo,sentDateStart,sentDateEnd,dueDateStart,dueDateEnd,selectedStatusFilters, sortName, sortType } = this.state;
        if (e.keyCode === 13) {
            this.setState({ searchList: true });
            this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters, e.target.value, sortName, sortType, responseRateFrom,responseRateTo,searchByName,true)
        }
    }

    keyPress2(e) {
    const { responseRateFrom,responseRateTo,sentDateStart,filterName,sentDateEnd,dueDateStart,dueDateEnd,selectedStatusFilters, sortName,searchByName, sortType } = this.state;
    if (e.keyCode === 13) {
        this.setState({ searchList: true });
        this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters, filterName, sortName, sortType, responseRateFrom,responseRateTo,e.target.value,true)
        }
    }

publishDateStart(val){
    const { selectedUnitFilters,e,sentDateStart,responseRateFrom,responseRateTo,filterName,sentDateEnd,dueDateStart,dueDateEnd, selectedCatFilters, selectedGroupCatFilters, selectedSubGroupCatFilters,searchByName, selectedStatusFilters, sortName, sortType } = this.state;
    this.setState({ sentDateStart: LocalDateTime(val),loading:1 })
    this.getSurveyAdminList(1, LocalDateTime(val), sentDateEnd, dueDateStart, dueDateEnd, selectedStatusFilters, filterName, sortName, sortType,responseRateFrom,responseRateTo,searchByName, true)
}

publishDateEnd(val){
    const { selectedUnitFilters,e,filterName, responseRateFrom,responseRateTo,searchByName, selectedCatFilters,sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedGroupCatFilters, selectedSubGroupCatFilters, selectedStatusFilters, sortName, sortType } = this.state;
    this.setState({ sentDateEnd: LocalDateTime(val) ,loading:1})
    this.getSurveyAdminList(1, sentDateStart,LocalDateTime(val) , dueDateStart, dueDateEnd, selectedStatusFilters, filterName, sortName, sortType,responseRateFrom,responseRateTo,searchByName, true)
}

dueDateStart(val){
    const { selectedUnitFilters,e, responseRateFrom,responseRateTo,selectedCatFilters, filterName,selectedGroupCatFilters, selectedSubGroupCatFilters,sentDateStart,sentDateEnd,dueDateStart,searchByName,dueDateEnd, selectedStatusFilters, sortName, sortType } = this.state;
    this.setState({ dueDateStart: LocalDateTime(val) ,loading:1})
    this.getSurveyAdminList(1, sentDateStart, sentDateEnd, LocalDateTime(val), dueDateEnd, selectedStatusFilters, filterName, sortName, sortType,responseRateFrom,responseRateTo,searchByName, true)
}

dueDateEnd(val){
    const { selectedUnitFilters,e,responseRateFrom,responseRateTo, selectedCatFilters,filterName ,selectedGroupCatFilters, selectedSubGroupCatFilters,sentDateStart,sentDateEnd,dueDateStart,searchByName,dueDateEnd, selectedStatusFilters, sortName, sortType } = this.state;
    this.setState({ dueDateEnd: LocalDateTime(val) ,loading:1})
    this.getSurveyAdminList(1, sentDateStart, sentDateEnd, dueDateStart,LocalDateTime(val) , selectedStatusFilters, filterName, sortName, sortType, responseRateFrom,responseRateTo,searchByName, true)
}
    handleRadioButtonClick(value, key, checked) {
        const { ActiveStatus, InActiveStatus, ExpiredStatus } = this.state;
        if (value == "Active") {
            this.clickFilter(key, 1, !ActiveStatus, "Status");
            this.setState({ ActiveStatus: !ActiveStatus, InActiveStatus: false, ExpiredStatus: false });
        } else if (value == "Inactive") {
            this.clickFilter(key, 2, !InActiveStatus, "Status");
            this.setState({ ActiveStatus: false, InActiveStatus: !InActiveStatus, ExpiredStatus: false });
        } else if (value == "Expired") {
            this.clickFilter(key, 3, !ExpiredStatus, "Status");
            this.setState({ ActiveStatus: false, InActiveStatus: false, ExpiredStatus: !ExpiredStatus });
        }
    }

    getEndDate(date) {
        if (date === "2999-12-31") {
            return
        } else {
            return date;
        }
    }

    onShowDatePicker = (quest) => {
        console.log('quest',quest);
        this.setState({
            showDatePicker: true,
            guid:quest.sguid,
            recurrenceType: quest.RecurrenceType,
            startDate: quest.StartDate,
            date: this.getEndDate(quest.EndDate) ? quest.EndDate : new Date(),
            questDueDateId: quest.Id
        });
    }

    onChangeDueDate = () => {
        const { questDueDateId,responseRateFrom,responseRateTo,sentDateStart,searchByName, sentDateEnd, dueDateStart, dueDateEnd, recurrenceType, startDate, date, pageNumber, selectedUnitFilters, selectedCatFilters, selectedGroupCatFilters, selectedSubGroupCatFilters, selectedStatusFilters, filterName, sortName, sortType } = this.state;
        let convertedEndDate = LocalDateTime(date);
        this.setState({ updatingEndDate: true });
        var dueDate = {"dueDate": convertedEndDate,"reason":""}
        new Api(GetAPIHeader(Storage.getAccessToken())).v31
            .sendSurveyChangeDueDate(this.state.guid, dueDate)
            .then(response => {
                this.setState({
                    showDatePicker: false,
                    updatingEndDate: false,
                    confirmationPopup: false
                });
                this.getSurveyAdminList(pageNumber, sentDateStart, sentDateEnd, dueDateStart, dueDateEnd, selectedStatusFilters, filterName, sortName, sortType,responseRateFrom,responseRateTo,searchByName, false);
            }).catch((err) => {
                ErrorHandling(err)
                this.setState({
                    updatingEndDate: false
                });
            });
    }

    onConfirm() {
        this.setState({
            confirmationPopup: true,
        })
    }

    closeModal = () => {
        this.setState({
            confirmationPopup: false,
        })
    }

    renderConfirmationModal() {
        const { t } = this.props;
        const { confirmationPopup, updatingEndDate } = this.state;
        if (confirmationPopup) {
            return (
                <Modal
                    show={confirmationPopup}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Header className='border-1 pb-2'>
                        <p className='font-weight-bold large'>{t('quest.updateEndDate')}</p>
                        <i className="fas fa-times text-gray position-absolute pointer" onClick={this.closeModal} style={{ right: "30px" }} />
                    </Modal.Header>
                    <Modal.Body className='pt-3'>
                        <p>{t('quest.endDateMsg')}</p>
                    </Modal.Body>
                    <Modal.Footer className='pt-4'>
                        <div className='d-flex align-items-center flex-row-reverse justify-content-end pr-2'>
                            <div className='pl-4' onClick={this.closeModal}>
                                <p className='font-weight-bold pointer'>{t('common.cancel')}</p>
                            </div>
                            <button
                                type="button"
                                data-dismiss="modal"
                                className="btn btn-primary"
                                onClick={this.onChangeDueDate}
                                style={{ width: "fit-content" }}
                            >
                                {t('quest.endDateConfirm')}
                                {updatingEndDate &&
                                    <span>
                                        &nbsp;<i className="fa fa-spinner fa-spin" />
                                    </span>}
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            )
        }
    }

    renderDueDatePicker() {
        const { t } = this.props;
        const { showDatePicker, date, recurrenceType } = this.state;
        if (showDatePicker) {
            return (
                <FilledDatePicker
                    formLabel={t('quest.endDate')}
                    disablePast={true}
                    open={showDatePicker}
                    value={date}
                    name={recurrenceType}
                    onAccept={(val) => this.onConfirm(val)}
                    onClose={() => this.setState({ showDatePicker: false })}
                    onChange={(val) => {
                        if (recurrenceType === "Monthly") {
                            let selectedMonth = new Date(val);
                            let selectedMonthEndDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
                            this.setState({ date: selectedMonthEndDate });
                        } else {
                            this.setState({ date: val });
                        }
                    }}
                    className="MuiOutlinedInput-input bg-white border"
                    placeholder={t('feedback.giveModalDatePH')}
                    minDate={new Date()}
                    openTo="month"
                    views={recurrenceType === "Monthly" ? ["year", "month"] : ['date']}
                />
            )
        }
    }

    onSurveyTabClick = (e) => {
        this.setState({ loading: false, questType: true, filterName: "" })
        this.getSurveyAdminList(1)
    }

    onRangechange(val){
        const {sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters,sortName, sortType,filterName,responseRateFrom,responseRateTo} = this.state
        console.log(val[0],val[1]);
        this.setState({responseRateFrom:val[0],responseRateTo:val[1]})
    }

    render() {

        const { showDeletePopup, responseRateFrom,responseRateTo,loading, adminQuestList,filterName,sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, pageNumber, 
             selectedStatusFilters, searchList, sortName, sortType,  filterStatus, tableHeader, searchByName } = this.state;
        const { t } = this.props;
        let currentDatetime = LocalDateTime(new Date())
        let futureDatetime  = LocalDateTime( addDay(new Date(), -7))
        console.log(currentDatetime,futureDatetime);
        return (
            
            loading ?
                <Loading /> :
                <div className="col sm-12">
                    <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} lightBackground />
                    {this.renderDueDatePicker()}
                    {this.renderConfirmationModal()}
                    {this.state.openResponsePopup &&  this.renderResponsePopup()}

                    <br />
                    <div className="row float-search">

                        <div className="col-md-12">
                            <div className="bg-white d-flex">
                                <div className="mr-2 ml-2">
                                    <i className="fa fa-search text-gray" style={{ marginTop: "82%", color: "#666" }}></i>
                                </div>
                                <div className="input-group" style={{ width: "100%" }}>
                                    <input id="surveySearch" type="search" className="border-0 p-3" placeholder={(t('survey.searchSurvey'))}

                                        value={filterName}
                                        style={{ width: "100%", height: "42px" }}
                                        onKeyDown={this.keyPress}
                                        onChange={(e) => {
                                            this.setState({ filterName: e.target.value, searchList: true });
                                            if (e.target.value == "") {
                                                this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters, e.target.value, sortName, sortType,responseRateFrom,responseRateTo,searchByName, true)
                                            }
                                        }} />
                                </div>

                                <div>

                                </div>
                            </div>
                        </div>
                    </div>
                    {<div className="row mt-3">
                        {
                        <div className={"form-group col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3"}>
                            <label for="action" style={{"color":"#252631"}} className="small font-weight-bold">{t("survey.sentOn")}</label>
                            <div className="d-flex">
                            
                            <FilledDatePicker
                            formLabel={""}
                            disablePast={false}
                            disableFuture={false}
                            value={sentDateStart===""? futureDatetime : sentDateStart}
                            name='date'
                            onChange={(val) => this.publishDateStart(val)}
                            className="MuiOutlinedInput-input bg-white mr-3"
                            placeHolder={""}
                            />

                            <FilledDatePicker
                            formLabel={""}
                            disablePast={false}
                            disableFuture={false}
                            value={sentDateEnd==="" ? currentDatetime : sentDateEnd}
                            name='date'
                            onChange={(val) => this.publishDateEnd(val)}
                            className="MuiOutlinedInput-input bg-white"
                            placeHolder={""}
                            />
                            </div>
                        </div>
                    }
                        {
                            <div className="form-group col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                                <label for="action" style={{"color":"#252631"}} className="small font-weight-bold">{t("survey.dueDate")}</label>
                                <div className="d-flex">
                            <FilledDatePicker
                                formLabel={""}
                                disablePast={false}
                                disableFuture={false}
                                value={dueDateStart==="" ? futureDatetime : dueDateStart}
                                name='date'
                                onChange={(val) => this.dueDateStart(val)}
                                className="MuiOutlinedInput-input bg-white mr-3"
                                placeHolder={""}
                            />
                            <FilledDatePicker
                                formLabel={""}
                                disablePast={false}
                                disableFuture={false}
                                value={dueDateEnd==="" ? currentDatetime : dueDateEnd}
                                name='date'
                                onChange={(val) => this.dueDateEnd(val)}
                                className="MuiOutlinedInput-input bg-white"
                                placeHolder={""}
                            />
                            </div>
                            </div>
                        }

                        {
                            <div className={this.state.displayUnitFilter ? "form-group col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2" : "form-group col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4"}>
                            <label for="action" style={{"color":"#252631"}} className="small font-weight-bold">{t("survey.response")}</label>
                           <div className="mt-3" onMouseUp={()=>{this.setState({loading:1}); this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters, filterName, sortName, sortType, responseRateFrom,responseRateTo,searchByName,true)}} >
                            <RangeSlider defaultValue={[responseRateFrom,responseRateTo]} onInput={(val)=>this.onRangechange(val)} />
                            </div>
                            <div className="d-flex justify-content-between mt-2"><span>{`${this.state.responseRateFrom}%`}</span><span>{`${this.state.responseRateTo} %`}</span></div>
                            </div>
                        }

                        <div className={this.state.displayUnitFilter ? "form-group col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2" : "form-group col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4"}>
                            <label for="action" style={{"color":"#252631"}} className="small font-weight-bold">{t("quest.StatusLabel")}</label>
                            <Select
                                styles={customStyles}
                                classNamePrefix="select"
                                value={this.state.selectedStatusFilters2}
                                onChange={event => { this.statusOnChange(event) }}
                                options={filterStatus}
                                placeholder={t('quest.commonAll')}
                                defaultValue={{ label: "All", value: "All" }}
                            />
                        </div>
                        <div className={this.state.displayUnitFilter ? "form-group col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2" : "form-group col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4"}>
                            <label for="action" style={{"color":"#252631"}} className="small font-weight-bold">{t("survey.createdBy")}</label>
                            <input id="surveySearch" type="search" className="p-3 searchName" placeholder={(t('survey.searchByName'))}
                                value={searchByName}
                                style={{ width: "100%", height: "47px" }}
                                onKeyDown={this.keyPress2}
                                onChange={(e) => {
                                    this.setState({ searchByName: e.target.value, searchList: true });
                                    if (e.target.value == "") {
                                    this.getSurveyAdminList(1, sentDateStart,sentDateEnd,dueDateStart,dueDateEnd, selectedStatusFilters, filterName, sortName, sortType,responseRateFrom,responseRateTo,e.target.value ,true)
                                    }
                            }} />
                        </div>
                    </div>}
                    {adminQuestList.length === 0 && searchList == false ?
                        <Empty image={emptyNotification}
                            text={t("survey.emptySurvey")} />
                        :
                        <>
                            {this.renderQuest()}
                            {showDeletePopup && this.renderDeletePopUp()}
                            <div>
                                <Pagination className="pagination modal-1"
                                    activePage={this.state.pageNumber}
                                    itemsCountPerPage={this.state.pageSize}
                                    totalItemsCount={this.state.totalPages}
                                    pageRangeDisplayed={3}
                                    onChange={this.handlePageChange.bind(this)}
                                />
                            </div>
                        </>
                    }
                </div>
        );
    }
}


export default withTranslation('translation', { withRef: true })((AdminSurvey));