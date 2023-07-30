import { reducerSelector } from "../utils";
import axios from "axios";

export const formulary = {
  data: {
    type: "", // tipo do formulario
    period: {
      // periodo do formulario
      from: "2021-10-4",
      to: "2022-10-4",
    },
    comission: [],
    answers: [],
  },
  list: [],
  loading: false,
};

export const ActionsTypes = {
  LOADING: "loading/formulary",
  GET_FORMULARIES: "list/formulary",
  GET_FORMULARY: "get/formulary",
  CLEAR_ALL: "clear/formulary",
  SET_ACTIVITY: "activity/formulary",
};

export const formularyReducer = reducerSelector(formulary, {
  [ActionsTypes.LOADING](state, action) {
    const dto = {
      ...state,
      loading: action.payload,
    };
    return dto;
  },
  [ActionsTypes.GET_FORMULARIES](state, action) {
    const dto = {
      ...state,
      list: action.payload,
    };
    return dto;
  },
  [ActionsTypes.GET_FORMULARY](state, action) {
    const dto = {
      ...state,
      data: action.payload,
    };
    return dto;
  },
  [ActionsTypes.SET_ACTIVITY](state, action) {
    const dto = {
      ...state,
      data: { ...state.data, answers: [...state.data.answers, action.payload] },
    };
    return dto;
  },
});

// ActionCreators
export const setLoading = (isLoading, dispatch) =>
  dispatch({ type: ActionsTypes.LOADING, payload: isLoading });
export const setFormularies = (list, dispatch) =>
  dispatch({ type: ActionsTypes.GET_FORMULARIES, payload: list });
export const setFormulary = (data, dispatch) =>
  dispatch({ type: ActionsTypes.GET_FORMULARY, payload: data });
export const setActivity = (data, dispatch) =>
  dispatch({ type: ActionsTypes.SET_ACTIVITY, payload: data });

export function getFormularies(dispatch) {
  setLoading(true, dispatch);
  return axios
    .get("/formularies")
    .then(({ data }) => {
      setFormularies(data, dispatch);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("siape");
      }
      return err;
    })
    .finally((res) => {
      setLoading(false, dispatch);
    });
}

export function getFormulary(formId, dispatch) {
  setLoading(true, dispatch);
  return axios
    .get(`/formulary/${formId}`)
    .then(({ data }) => {
      setFormulary(data, dispatch);
      return data;
    })
    .catch((err) => {
      throw err;
    })
    .finally((res) => {
      setLoading(false, dispatch);
    });
}

export function updateFormAnswer(form, dispatch) {
  setLoading(true, dispatch);
  return axios
    .put(`/formularyAnswer`, form)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      throw err;
    })
    .finally((res) => {
      setLoading(false, dispatch);
    });
}

export async function createFormulary(form, dispatch) {
  setLoading(true, dispatch);
  return await axios
    .post("/formulary", form)
    .then(({ data }) => {
      setFormulary(data, dispatch);
      return data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    })
    .finally((res) => {
      setLoading(false, dispatch);
    });
}

export function closeFormulary(form, dispatch) {
  setLoading(true, dispatch);
  return axios
    .post(`/formulary/${form.id}/close`, form)
    .then(({ data }) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    })
    .finally((res) => {
      setLoading(false, dispatch);
    });
}

export async function deleteFormulary(formId, dispatch) {
  setLoading(true, dispatch);
  return await axios
    .delete(`/formulary/${formId}`)
    .then(({ data }) => {
      setFormulary(data, dispatch);
      return data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    })
    .finally((res) => {
      setLoading(false, dispatch);
    });
}

export async function deleteFormularyAnswer(formId, formAnswerId, dispatch) {
  setLoading(true, dispatch);
  return await axios
    .delete(`/formularyAnswer/${formId}/${formAnswerId}`)
    .then(({ data }) => {
      setFormulary(data, dispatch);
      return data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    })
    .finally((res) => {
      setLoading(false, dispatch);
    });
}
