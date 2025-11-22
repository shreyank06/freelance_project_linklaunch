import https from "https";

export interface JoobleJobListing {
  uid: string;
  url: string;
  position: string;
  company: {
    name: string;
    logo_url?: string;
    is_verified?: boolean;
  };
  location: {
    name: string;
  };
  salary: string;
  estimated_salary?: number;
  content: string;
  full_content: string;
  date_updated: string;
  date_caption: string;
  is_remote_job: boolean;
  job_type: string | null;
  tags: Array<{
    name: string;
    text: string;
    category_name: string;
  }>;
}

export interface JoobleSearchParams {
  keyword: string;
  location: string;
  salary_min?: string;
  job_type?: string;
  posted_date?: string;
}

/**
 * Search jobs from Jooble API
 */
export async function searchJoobleJobs(params: JoobleSearchParams): Promise<JoobleJobListing[]> {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.JOOBLE_API_KEY;

    if (!apiKey) {
      reject(new Error("JOOBLE_API_KEY is not configured"));
      return;
    }

    const requestBody = JSON.stringify({
      keywords: params.keyword,
      location: params.location,
      salary_min: params.salary_min || "",
      job_type: params.job_type || "",
      posted_date: params.posted_date || "",
    });

    const options = {
      hostname: "jooble.org",
      port: 443,
      path: `/api/${apiKey}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const parsed = JSON.parse(data);
            const jobs = parsed.jobs || [];
            resolve(jobs);
          } else {
            reject(new Error(`Jooble API error: ${res.statusCode} ${res.statusMessage}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse Jooble response: ${error}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Jooble API request failed: ${error.message}`));
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Jooble API request timeout"));
    });

    req.write(requestBody);
    req.end();
  });
}

/**
 * Convert Jooble job to standardized format
 */
export function convertJoobleToStandard(job: JoobleJobListing) {
  return {
    id: job.uid,
    title: job.position,
    company: job.company.name,
    location: job.location.name,
    salary: job.salary || job.estimated_salary?.toString() || "Not specified",
    description: job.content,
    fullDescription: job.full_content,
    url: job.url,
    datePosted: job.date_updated,
    dateCaption: job.date_caption,
    isRemote: job.is_remote_job,
    jobType: job.job_type,
    tags: job.tags,
    source: "jooble",
  };
}
