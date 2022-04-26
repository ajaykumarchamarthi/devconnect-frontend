import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import classes from "./Jobs.module.css";
import axios from "axios";

function Jobs() {
  const history = useHistory();

  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    const loadJobs = async () => {
      const response = await axios.get(
        "https://devconnect-backendapp.herokuapp.com/api/v1/jobs/getAllJobs"
      );
      const { data } = response.data;
      setAllJobs(data.jobs);
    };

    loadJobs();
  }, []);

  return (
    <div className={classes.outerContainer}>
      <h3>Jobs</h3>
      {allJobs.map((job) => {
        return (
          <div className={classes.container} key={job._id}>
            <div className={classes.company}>
              <img
                className={classes.img}
                src={job.companyLogo}
                alt="company logo"
              />
              <h5>{job.companyName}</h5>
            </div>
            <div className={classes.description}>
              <p>
                <span className={classes.highlight}>{job.companyName}</span>{" "}
                looking to hire for a role{" "}
                <span className={classes.highlight}>{job.jobDescription}</span>.
              </p>
              <p className={classes.toApply}>
                To know more{" "}
                <span
                  className={classes.redirect}
                  onClick={() => history.replace(`/jobDetails/${job._id}`)}
                >
                  click here
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Jobs;
