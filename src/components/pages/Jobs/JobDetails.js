import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import classes from "./JobDetails.module.css";

function JobDetails() {
  const [job, setJob] = useState([]);
  const params = useParams();

  const jobId = params.jobId;

  useEffect(() => {
    const loadJobs = async () => {
      const response = await axios.get(
        "https://devconnect-backendapp.herokuapp.com/api/v1/jobs/getAllJobs"
      );
      const { data } = response.data;
      const filteredJob = data.jobs.filter((job) => job._id === jobId);
      setJob(filteredJob);
    };

    loadJobs();
  }, [jobId]);

  return (
    <div className={classes.container}>
      {job.map((company) => (
        <div className={classes.company} key={company._id}>
          <div className={classes.logo}>
            <img
              src={company.companyLogo}
              className={classes.companyLogo}
              alt="logo"
            />
            <h4>{company.companyName}</h4>
          </div>

          <p className={classes.about}>{company.companyDescription}</p>

          <div className={classes.jobDetails}>
            <ul>
              <li>
                <span className={classes.key}>Role</span>{" "}
                {company.jobDescription}
              </li>
              <li>
                <span className={classes.key}>Salary</span> - {company.salary}
              </li>
              <li>
                <span className={classes.key}>Work Location</span> -{" "}
                {company.workLocation}
              </li>
            </ul>
          </div>
          <div className={classes.apply}>
            <p>
              Visit Company career page attached below to apply for the role
            </p>
            <a
              className={classes.redirect}
              href={company.companyWebsite}
              target="_blank"
              rel="noreferrer noopener"
            >
              {company.companyWebsite}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobDetails;
