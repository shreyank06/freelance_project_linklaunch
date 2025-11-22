/**
 * External Job Listing Service
 * Integrates with JSearch, RemoteOK, and Adzuna APIs to provide consolidated job listings
 */

import type { JobListing } from "@shared/schema";

interface ExternalJobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  source: "jsearch" | "remoteok" | "adzuna" | "arbeitnow" | "jooble";
  applyUrl?: string;
  countryCode?: string;
}

// JSearch API Configuration
const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const JSEARCH_HOST = "jsearch.p.rapidapi.com";

// Adzuna API Configuration
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

// Jooble API Configuration
const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY || "9843a1946d92b43d45b8d9e02af8fb15";

// RemoteOK doesn't require API key (public API)

async function fetchFromJSearch(query: string, includeLocation?: string): Promise<ExternalJobData[]> {
  if (!JSEARCH_API_KEY) {
    console.warn("JSearch API key not configured");
    return getLinkedInSearchLink(query, includeLocation);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    // Always search without location in query - we'll filter by location later
    // JSearch works better with just the job title/skill
    const searchQuery = query;

    // Request 2 pages to get more results
    const numPages = 2;

    // Search globally (multiple countries) - not restricted to US
    const response = await fetch(
      `https://${JSEARCH_HOST}/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=${numPages}&date_posted=all`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": JSEARCH_API_KEY,
          "x-rapidapi-host": JSEARCH_HOST,
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`JSearch API error: ${response.status} - providing LinkedIn search link`);
      return getLinkedInSearchLink(query, includeLocation);
    }

    const data = await response.json();

    // Check if quota exceeded
    if (data.message && data.message.includes("exceeded") && data.message.includes("quota")) {
      console.warn(`⚠️  JSearch API QUOTA EXCEEDED - providing LinkedIn search link`);
      return getLinkedInSearchLink(query, includeLocation);
    }

    if (!data.data || !Array.isArray(data.data)) {
      console.log(`JSearch returned no data for query: ${query}`);
      return getLinkedInSearchLink(query, includeLocation);
    }

    console.log(`JSearch found ${data.data.length} jobs for query: ${query}`);

    return data.data.map((job: any) => ({
      id: `jsearch-${job.job_id}`,
      title: job.job_title || "Untitled Position",
      company: job.employer_name || "Company Name Unavailable",
      location: job.job_city ? (job.job_state ? `${job.job_city}, ${job.job_state}` : job.job_city) : (job.job_country && job.job_country.length > 2 ? job.job_country : "Remote"),
      salary: formatSalary(job.job_min_salary, job.job_max_salary, job.job_salary_currency),
      description: job.job_description?.substring(0, 500) || "No description available",
      source: "jsearch" as const,
      applyUrl: job.job_apply_link,
      countryCode: job.job_country,
    }));
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn("JSearch API request timeout - providing LinkedIn search link");
    } else {
      console.warn("JSearch API error - providing LinkedIn search link");
    }
    return getLinkedInSearchLink(query, includeLocation);
  }
}

// LinkedIn location ID mapping
const locationIdMap: { [key: string]: string } = {
  "india": "102713980",
  "united states": "103644243",
  "usa": "103644243",
  "uk": "101165590",
  "united kingdom": "101165590",
  "germany": "100253013",
  "france": "100505898",
  "canada": "103714735",
  "australia": "100490277",
  "japan": "102029554",
  "singapore": "102454443",
  "dubai": "100893291",
  "uae": "100893291",
  "netherlands": "102890719",
  "spain": "100994617",
  "italy": "103350119",
  "brazil": "100988488",
  "mexico": "103596953",
  "ireland": "101393091",
};

function getLinkedInSearchLink(query: string, location?: string): ExternalJobData[] {
  // Create a LinkedIn search link based on job title and location
  // Use LinkedIn's location filter with proper location IDs
  let linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}`;

  if (location) {
    const locationLower = location.toLowerCase().trim();
    const locationId = locationIdMap[locationLower];

    if (locationId) {
      // Use LinkedIn's geoId parameter for proper location filtering
      linkedInUrl += `&geoId=${locationId}`;
    }
  }

  return [
    {
      id: `linkedin-search-${Date.now()}`,
      title: `Search "${query}"${location ? ` in ${location}` : ""} on LinkedIn`,
      company: "LinkedIn",
      location: location || "Worldwide",
      salary: "Salary varies",
      description: `Click to search for ${query} positions${location ? ` in ${location}` : ""} on LinkedIn. LinkedIn's filters will be applied to show jobs in your selected location.`,
      source: "jsearch" as const,
      applyUrl: linkedInUrl,
      countryCode: location || "Global",
    }
  ];
}

async function fetchFromRemoteOK(query: string): Promise<ExternalJobData[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch("https://remoteok.com/api", {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`RemoteOK API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    // Filter jobs that match the query
    const lowerQuery = query.toLowerCase();
    const filtered = data
      .filter((job: any) => {
        const searchableText = `${job.position} ${job.company} ${(job.tags || []).join(" ")}`.toLowerCase();
        return searchableText.includes(lowerQuery);
      })
      .slice(0, 10);

    console.log(`RemoteOK found ${filtered.length} jobs for query: ${query}`);

    return filtered.map((job: any) => ({
      id: `remoteok-${job.id}`,
      title: job.position || "Untitled Position",
      company: job.company || "Company Name Unavailable",
      location: job.location || "Remote",
      salary: formatRemoteOKSalary(job.salary_min, job.salary_max),
      description: stripHtml(job.description?.substring(0, 500)) || "No description available",
      source: "remoteok" as const,
      applyUrl: job.url,
    }));
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn("RemoteOK API request timeout");
    } else {
      console.error("RemoteOK API error:", error.message);
    }
    return [];
  }
}

async function fetchFromAdzuna(query: string): Promise<ExternalJobData[]> {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    console.warn("Adzuna API credentials not configured");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=10&what=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`Adzuna API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((job: any) => ({
      id: `adzuna-${job.id}`,
      title: job.title || "Untitled Position",
      company: job.company?.display_name || "Company Name Unavailable",
      location: job.location?.display_name || "Location Not Specified",
      salary: formatAdzunaSalary(job.salary_min, job.salary_max),
      description: stripHtml(job.description?.substring(0, 500)) || "No description available",
      source: "adzuna" as const,
      applyUrl: job.redirect_url,
    }));
  } catch (error) {
    console.error("Adzuna API error:", error);
    return [];
  }
}

function formatSalary(min?: number, max?: number, currency?: string): string {
  if (!min && !max) return "Salary not disclosed";
  const curr = currency || "USD";
  if (min && max) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()} ${curr}`;
  }
  if (min) {
    return `$${min.toLocaleString()}+ ${curr}`;
  }
  return `Up to $${max?.toLocaleString()} ${curr}`;
}

function formatRemoteOKSalary(min?: number, max?: number): string {
  if (!min && !max) return "Salary not disclosed";
  if (min && max) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  if (min) {
    return `$${min.toLocaleString()}+`;
  }
  return `Up to $${max?.toLocaleString()}`;
}

function formatAdzunaSalary(min?: number, max?: number): string {
  if (!min && !max) return "Salary not disclosed";
  if (min && max) {
    return `£${min.toLocaleString()} - £${max.toLocaleString()}`;
  }
  if (min) {
    return `£${min.toLocaleString()}+`;
  }
  return `Up to £${max?.toLocaleString()}`;
}

function stripHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

async function fetchFromArbeitnow(query: string): Promise<ExternalJobData[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Arbeitnow API - jobs from Europe/Germany and other regions
    const response = await fetch(
      `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}`,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Arbeitnow API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.log(`Arbeitnow returned no data for query: ${query}`);
      return [];
    }

    console.log(`Arbeitnow found ${data.data.length} jobs for query: ${query}`);

    return data.data.map((job: any) => ({
      id: `arbeitnow-${job.slug}`,
      title: job.title || "Untitled Position",
      company: job.company_name || "Company Name Unavailable",
      location: job.location || "Europe",
      salary: "Salary not disclosed",
      description: stripHtml(job.description?.substring(0, 500)) || "No description available",
      source: "arbeitnow" as const,
      applyUrl: job.url,
    }));
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn("Arbeitnow API request timeout");
    } else {
      console.error("Arbeitnow API error:", error.message);
    }
    return [];
  }
}

async function fetchFromArbeitnowEnhanced(query: string, location?: string): Promise<ExternalJobData[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Arbeitnow API - Free, no auth required, European & English-speaking jobs
    const response = await fetch(
      `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}`,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Arbeitnow Enhanced API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.log(`Arbeitnow returned no data for query: ${query}`);
      return [];
    }

    console.log(`Arbeitnow found ${data.data.length} jobs for query: ${query}${location ? ` in ${location}` : ""}`);

    return data.data.map((job: any) => ({
      id: `arbeitnow-enhanced-${job.slug}`,
      title: job.title || "Untitled Position",
      company: job.company_name || "Company Name Unavailable",
      location: job.location || "Europe",
      salary: "Salary not disclosed",
      description: stripHtml(job.description?.substring(0, 500)) || "No description available",
      source: "arbeitnow" as const,
      applyUrl: job.url,
    }));
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn("Arbeitnow Enhanced API request timeout");
    } else {
      console.error("Arbeitnow Enhanced API error:", error.message);
    }
    return [];
  }
}

async function fetchFromLinkedInIndia(query: string): Promise<ExternalJobData[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // LinkedIn India job search - returning search links that users can click
    // LinkedIn doesn't have a public API, so we're providing direct search links
    const linkedinSearchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=India`;

    // For now, return a reference to LinkedIn India search as we can't scrape without violating ToS
    // This provides users with a direct link to find real India jobs on LinkedIn
    const response: ExternalJobData[] = [
      {
        id: `linkedin-india-search-${Date.now()}`,
        title: `Search ${query} jobs on LinkedIn India`,
        company: "LinkedIn India",
        location: "India",
        salary: "Salary varies",
        description: `Find real ${query} job opportunities across India on LinkedIn. Click apply URL to search directly.`,
        source: "arbeitnow" as const,
        applyUrl: linkedinSearchUrl,
      }
    ];

    clearTimeout(timeoutId);
    return response;

  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn("LinkedIn India API request timeout");
    } else {
      console.error("LinkedIn India API error:", error.message);
    }
    return [];
  }
}

function getIndiaJobsFromNaukri(query: string): ExternalJobData[] {
  // Generate Naukri India job search links (real jobs, free platform)
  const naukriSearchUrl = `https://www.naukri.com/jobs-${encodeURIComponent(query)}`;

  return [
    {
      id: `naukri-india-search-${Date.now()}`,
      title: `Search ${query} jobs on Naukri.com`,
      company: "Naukri.com",
      location: "India",
      salary: "Salary varies",
      description: `Browse real ${query} job listings from India's largest job portal with thousands of active positions.`,
      source: "arbeitnow" as const,
      applyUrl: naukriSearchUrl,
    }
  ];
}

function deduplicateJobs(jobs: ExternalJobData[]): ExternalJobData[] {
  const seen = new Set<string>();
  const deduped: ExternalJobData[] = [];

  for (const job of jobs) {
    // Create a signature based on normalized title and company
    const signature = `${job.title.toLowerCase().trim()}-${job.company.toLowerCase().trim()}`;

    if (!seen.has(signature)) {
      seen.add(signature);
      deduped.push(job);
    }
  }

  return deduped;
}

export interface JobFilters {
  query: string;
  jobType?: "remote" | "onsite" | "hybrid";
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export async function searchExternalJobs(filters: JobFilters): Promise<ExternalJobData[]> {
  const { query, location } = filters;

  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    // Fetch from all APIs in parallel
    // Primary sources: JSearch (Google Jobs aggregation), Arbeitnow (European/remote), RemoteOK, Adzuna
    const [jsearchJobs, arbeitnowJobs, remoteokJobs, adzunaJobs] = await Promise.allSettled([
      fetchFromJSearch(query, location),
      fetchFromArbeitnowEnhanced(query, location),
      fetchFromRemoteOK(query),
      fetchFromAdzuna(query),
    ]);

    const allJobs: ExternalJobData[] = [];
    let jsearchQuotaExceeded = false;

    if (jsearchJobs.status === "fulfilled") {
      allJobs.push(...jsearchJobs.value);
    } else if (jsearchJobs.status === "rejected") {
      if (jsearchJobs.reason?.message === "JSEARCH_QUOTA_EXCEEDED") {
        jsearchQuotaExceeded = true;
        console.warn("⚠️  JSEARCH API QUOTA EXCEEDED - Limited job results available");
      }
    }

    if (arbeitnowJobs.status === "fulfilled") {
      allJobs.push(...arbeitnowJobs.value);
    }
    if (remoteokJobs.status === "fulfilled") {
      allJobs.push(...remoteokJobs.value);
    }
    if (adzunaJobs.status === "fulfilled") {
      allJobs.push(...adzunaJobs.value);
    }

    console.log(`Total jobs from all sources: ${allJobs.length} (JSearch, Arbeitnow, RemoteOK, Adzuna)`);

    // Apply filters
    let filtered = filterJobs(allJobs, filters);

    // Deduplicate and return top results
    const deduplicated = deduplicateJobs(filtered);
    return deduplicated.slice(0, 60); // Return top 60 results
  } catch (error) {
    console.error("Error searching external jobs:", error);
    return [];
  }
}

function filterJobs(jobs: ExternalJobData[], filters: JobFilters): ExternalJobData[] {
  return jobs.filter(job => {
    // Filter by job type (remote/onsite/hybrid)
    if (filters.jobType) {
      const locationLower = job.location.toLowerCase();

      if (filters.jobType === "remote") {
        // Check if job is marked as remote
        if (!locationLower.includes("remote")) {
          return false;
        }
      } else if (filters.jobType === "onsite") {
        // Onsite means not remote
        if (locationLower.includes("remote")) {
          return false;
        }
      }
      // hybrid is included by default (jobs that don't specify are assumed flexible)
    }

    // Filter by location
    if (filters.location) {
      const jobLocationLower = job.location.toLowerCase();
      const filterLocationLower = filters.location.toLowerCase();
      const jobCountryLower = job.countryCode ? job.countryCode.toLowerCase() : "";

      // LinkedIn search links (company === "LinkedIn") should always pass through
      // since they already include the location in the search URL
      const isLinkedInSearch = job.company === "LinkedIn";

      if (!isLinkedInSearch) {
        // For real jobs, check if location or country matches the filter
        const locationMatches =
          jobLocationLower.includes(filterLocationLower) || // City/state match
          jobCountryLower.includes(filterLocationLower) ||  // Country code match
          filterLocationLower.includes(jobCountryLower);    // Reverse match for short codes

        if (!locationMatches) {
          return false;
        }
      }
    }

    // Filter by salary range
    if (filters.salaryMin || filters.salaryMax) {
      const salaryRange = job.salary?.toLowerCase() || "";

      // Try to extract salary numbers from salary range string
      const salaryNumbers = salaryRange.match(/\d+/g)?.map(Number) || [];

      if (salaryNumbers.length > 0) {
        const minSalary = Math.min(...salaryNumbers);
        const maxSalary = Math.max(...salaryNumbers);

        if (filters.salaryMin && maxSalary < filters.salaryMin) {
          return false;
        }
        if (filters.salaryMax && minSalary > filters.salaryMax) {
          return false;
        }
      }
    }

    return true;
  });
}

export function convertToJobListing(externalJob: ExternalJobData): JobListing {
  const keywords = [externalJob.title, externalJob.company, externalJob.source];

  // Include apply URL in keywords if available (for frontend to extract)
  if (externalJob.applyUrl) {
    keywords.push(`apply_url:${externalJob.applyUrl}`);
  }

  return {
    id: externalJob.id,
    title: externalJob.title,
    company: externalJob.company,
    location: externalJob.location,
    description: externalJob.description,
    salaryRange: externalJob.salary || "Salary not disclosed",
    experienceLevel: "entry",
    keywords,
    createdAt: new Date(),
  };
}
