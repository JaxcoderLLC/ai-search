"use client";

import { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

export type Category = {
  name: string;
  description: string;
};

export default function Home() {
  const [request, setRequest] = useState<{
    category?: Category;
    location?: string;
    distance?: string;
    rating?: string;
  }>({});
  const [contractors, setContractors] = useState<string>("");
  const [locationOption, setLocationOption] = useState<string>("city");

  useEffect(() => {
    checkRedirect();
  }, []);

  function checkRedirect() {
    if (window.location.hostname === "the-contractor.vercel.app") {
      window.location.replace("https://www.contractor.jaxcoder.xyz/");
    }
  }

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function hitAPI() {
    try {
      if (!request.location || !request.category) return;
      setMessage("Searching your area for service providers...");
      setLoading(true);
      setContractors("");

      setTimeout(() => {
        if (!loading) return;
        setMessage("Getting closer ...");
      }, 7000);

      setTimeout(() => {
        if (!loading) return;
        setMessage("Almost there ...");
      }, 15000);

      const contractorData = await fetch("/api/get-contractors", {
        method: "POST",
        body: JSON.stringify({
          category: request.category,
          location: request.location,
          distance: request.distance,
          rating: request.rating,
        }),
      });
      const contractorDataJson = await contractorData.json();
      console.log("contractorDataJson: ", contractorDataJson);

      // const poiData = await fetch("/api/get-points-of-interest", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     pointsOfInterestPrompt: contractorDataJson.pointsOfInterestPrompt,
      //   }),
      // });
      // const poiDataJson = await poiData.json();
      // console.log("poiDataJson: ", poiDataJson);

      // let pointsOfInterest = JSON.parse(poiDataJson.pointsOfInterest);
      let contractors = contractorDataJson.contractors;

      // pointsOfInterest.map((point) => {
      // contractors = contractors.replace(point, `<a target="_blank" rel="no-opener" href="https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)}">${point}</a>`)
      // contractors = contractors.replace(
      //   point,
      //   `[${point}](https://www.google.com/search?q=${encodeURIComponent(
      //     point + " " + request.city
      //   )})`
      // );
      // });

      console.log("contractors: ", contractors);

      setContractors(contractors);
      setLoading(false);
    } catch (err) {
      console.log("error: ", err);
      setMessage("");
    }
  }

  const locationOptions = [
    { value: "", label: "Select Location" },
    { value: "city", label: "City" },
    { value: "zip code", label: "Zip Code" },
  ];

  const distanceOptions = [
    { value: "", label: "Select Distance" },
    { value: "5", label: "5 Miles" },
    { value: "10", label: "10 Miles" },
    { value: "15", label: "15 Miles" },
    { value: "20", label: "20 Miles" },
    { value: "25", label: "25 Miles" },
  ];

  const ratingOptions = [
    { value: "", label: "Select Rating" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ];

  return (
    <main>
      <div className="app-container">
        <h1 style={styles.header} className="hero-header">
          Find Me A Contractor
        </h1>
        <div style={styles.formContainer} className="form-container">
          <select
            name="location-options"
            style={styles.input}
            onChange={(e) => {
              setLocationOption(e?.target.value || "city");
              setRequest((request) => ({
                ...request,
                location: "",
              }));
            }}
          >
            {locationOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            style={styles.input}
            placeholder={locationOption === "city" ? "City" : "Zip Code"}
            onChange={(e) =>
              setRequest((request) => ({
                ...request,
                location: e.target.value,
              }))
            }
          />
          <select
            name="distance-options"
            style={styles.input}
            onChange={(e) => {
              setRequest((request) => ({
                ...request,
                distance: e.target.value,
              }));
            }}
          >
            {distanceOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            style={styles.input}
            placeholder="Category"
            onChange={(e) =>
              setRequest((request) => ({
                ...request,
                category: { name: e.target.value, description: "" },
              }))
            }
          />
          <select
            name="rating-options"
            style={styles.input}
            onChange={(e) => {
              setRequest((request) => ({
                ...request,
                rating: e.target.value,
              }));
            }}
          >
            {ratingOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="input-button" onClick={hitAPI}>
            Find Services
          </button>
        </div>
        <div className="results-container">
          {loading && <p>{message}</p>}
          {contractors && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: (props) => {
                  return (
                    <a
                      target="_blank"
                      rel="noreferrer no-opener"
                      href={props.href}
                    >
                      {props.children}
                    </a>
                  );
                },
              }}
            >
              {contractors[0].trim()}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </main>
  );
}

const styles = {
  header: {
    textAlign: "center" as "center",
    marginTop: "60px",
    color: "#c683ff",
    fontWeight: "900",
    fontFamily: "Poppins",
    fontSize: "68px",
  },
  input: {
    padding: "10px 14px",
    marginBottom: "4px",
    outline: "none",
    fontSize: "16px",
    width: "100%",
    borderRadius: "8px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    margin: "20px auto 0px",
    padding: "20px",
    boxShadow: "0px 0px 12px rgba(198, 131, 255, .2)",
    borderRadius: "10px",
  },
  result: {
    color: "white",
  },
};
