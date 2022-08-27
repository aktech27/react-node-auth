const useFetch = (URL, METHOD, DATA, HEADER) => {
  return new Promise(async (resolve) => {
    const response = await fetch(URL, {
      method: METHOD,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...HEADER,
      },
      body: JSON.stringify(DATA),
    });
    const data = await response.json();
    resolve({ ok: response.ok, data });
  });
};

export default useFetch;
