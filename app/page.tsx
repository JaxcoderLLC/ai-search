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
    city?: string;
  }>({});
  let [contractors, setContractors] = useState<string>("");

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
      if (!request.city || !request.category) return;
      setMessage("Searching your area for contractors...");
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
          city: request.city,
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

  return (
    <main>
      <div className="app-container">
        <h1 style={styles.header} className="hero-header">
          Find Me A Contractor
        </h1>
        <div style={styles.formContainer} className="form-container">
          <input
            style={styles.input}
            placeholder="City"
            onChange={(e) =>
              setRequest((request) => ({
                ...request,
                city: e.target.value,
              }))
            }
          />
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
          <button className="input-button" onClick={hitAPI}>
            Find Contractor
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
