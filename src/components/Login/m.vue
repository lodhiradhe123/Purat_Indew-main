<template>
  <div class="gsm-panel">
    <!-- Simplified Header with Just the Title -->
    <header class="main-header animate__animated animate__fadeInDown">
      <div class="logo">
        <i class="fas fa-sms"></i>
        <h1>SMS Dashboard</h1>
      </div>
    </header>

    <!-- Date Range Section -->
    <div class="date-range-section animate__animated animate__fadeIn">
      <div class="date-range-container">
        <label for="start-date">Start Date:</label>
        <input type="date" v-model="startDate" id="start-date" class="date-input" @change="validateDate" />
      </div>
      <div class="date-range-container">
        <label for="end-date">End Date:</label>
        <input type="date" v-model="endDate" id="end-date" class="date-input" @change="validateDate" />
      </div>
      <div class="apply-button-container">
        <button @click="applyDateRange" class="apply-button" :disabled="!validDates">
          Apply Date Range
        </button>
      </div>
      <div class="search-input-container">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search RID or message"
          class="search-input"
        />
      </div>
    </div>

    <!-- Navigation Section -->
    <div class="nav-section animate__animated animate__fadeIn">
      <button @click="activeSection = 'campaigns'"><i class="fas fa-bullhorn"></i> Campaigns</button>
      <button @click="activeSection = 'queue'"><i class="fas fa-list"></i> Queue</button>
      <button @click="activeSection = 'processed'"><i class="fas fa-check-circle"></i> Processed</button>
      <button @click="activeSection = 'ports'"><i class="fas fa-network-wired"></i> Ports</button>
    </div>

    <!-- Content Section -->
    <div class="content-section animate__animated animate__fadeInUp">
      <!-- Loading Spinner -->
      <div v-if="loading" class="loading-spinner">
        <p>Loading...</p>
      </div>

      <!-- Campaigns Section -->
      <div v-if="activeSection === 'campaigns' && !loading">
        <h3><i class="fas fa-bullhorn"></i> Campaigns</h3>
        <table class="styled-table">
          <thead>
            <tr>
              <th>RID</th>
              <th>Message</th>
              <th>Date</th>
              <th>Export</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="campaign in paginatedCampaigns" :key="campaign.requestid">
              <td>{{ campaign.requestid }}</td>
              <td>{{ campaign.msg }}</td>
              <td>{{ formatDate(campaign.dte) }}</td>
              <td>
                <button @click="exportCsv(campaign.requestid)"><i class="fas fa-file-export"></i> Export CSV</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>

      <!-- Queue Section -->
      <div v-if="activeSection === 'queue' && !loading">
        <h3><i class="fas fa-list"></i> Queue</h3>
        <table class="styled-table">
          <thead>
            <tr>
              <th>Mobile No.</th>
              <th>Message</th>
              <th>Date/Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="queue in paginatedQueues" :key="queue.mo_no">
              <td>{{ queue.mo_no }}</td>
              <td>{{ queue.msg }}</td>
              <td>{{ formatDate(queue.tme) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination for Queue -->
        <div class="pagination">
          <button @click="prevQueuePage" :disabled="currentQueuePage === 1">Previous</button>
          <span>Page {{ currentQueuePage }} of {{ totalQueuePages }}</span>
          <button @click="nextQueuePage" :disabled="currentQueuePage === totalQueuePages">Next</button>
        </div>
      </div>

      <!-- Processed Section -->
      <div v-if="activeSection === 'processed' && !loading">
        <h3><i class="fas fa-check-circle"></i> Processed</h3>
        <table class="styled-table">
          <thead>
            <tr>
              <th>Mobile No.</th>
              <th>Message</th>
              <th>Date/Time</th>
              <th>Port</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="processed in paginatedProcessedData" :key="processed.mo_no">
              <td>{{ processed.mo_no }}</td>
              <td>{{ processed.msg }}</td>
              <td>{{ formatDate(processed.tme) }}</td>
              <td>{{ processed.port }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination for Processed -->
        <div class="pagination">
          <button @click="prevProcessedPage" :disabled="currentProcessedPage === 1">Previous</button>
          <span>Page {{ currentProcessedPage }} of {{ totalProcessedPages }}</span>
          <button @click="nextProcessedPage" :disabled="currentProcessedPage === totalProcessedPages">Next</button>
        </div>
      </div>

      <!-- Ports Section -->
      <div v-if="activeSection === 'ports' && !loading">
        <h3><i class="fas fa-network-wired"></i> Ports</h3>
        <table class="styled-table">
          <thead>
            <tr>
              <th>Port</th>
              <th>Usage</th>
              <th>Reset</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="port in ports" :key="port.port">
              <td>{{ port.port }}</td>
              <td>{{ port.messages_sent }}</td>
              <td>
                <button @click="resetPort(port.port)"><i class="fas fa-sync-alt"></i> Reset</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: this.getCurrentDate(), // Default to today
      endDate: this.getCurrentDate(),     // Default to today
      searchTerm: '',
      activeSection: 'campaigns',          // Default active section
      campaigns: [],
      queues: [],
      processedData: [],
      ports: [],
      loading: false,
      validDates: true,
      currentPage: 1,
      currentQueuePage: 1,
      currentProcessedPage: 1,
      itemsPerPage: 5,                    // Set items per page for pagination
    };
  },
  computed: {
    paginatedCampaigns() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.filteredCampaigns.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredCampaigns.length / this.itemsPerPage);
    },
    filteredCampaigns() {
      return this.campaigns.filter(campaign => {
        const inDateRange =
          (!this.startDate || new Date(campaign.dte) >= new Date(this.startDate)) &&
          (!this.endDate || new Date(campaign.dte) <= new Date(this.endDate));
        const matchesSearch =
          campaign.requestid.includes(this.searchTerm) ||
          campaign.msg.includes(this.searchTerm);
        return inDateRange && matchesSearch;
      });
    },
    paginatedQueues() {
      const start = (this.currentQueuePage - 1) * this.itemsPerPage;
      const end = this.currentQueuePage * this.itemsPerPage;
      return this.queues.slice(start, end);
    },
    totalQueuePages() {
      return Math.ceil(this.queues.length / this.itemsPerPage);
    },
    paginatedProcessedData() {
      const start = (this.currentProcessedPage - 1) * this.itemsPerPage;
      const end = this.currentProcessedPage * this.itemsPerPage;
      return this.filteredProcessedData.slice(start, end);
    },
    totalProcessedPages() {
      return Math.ceil(this.filteredProcessedData.length / this.itemsPerPage);
    },
    filteredProcessedData() {
      return this.processedData.filter(processed => {
        const inDateRange =
          (!this.startDate || new Date(processed.tme) >= new Date(this.startDate)) &&
          (!this.endDate || new Date(processed.tme) <= new Date(this.endDate));
        const matchesSearch =
          processed.mo_no.includes(this.searchTerm) ||
          processed.msg.includes(this.searchTerm);
        return inDateRange && matchesSearch;
      });
    },
  },
  methods: {
    getCurrentDate() {
      const date = new Date();
      return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    },
    async applyDateRange() {
      this.loading = true;
      try {
        // Fetch Campaigns
        const responseCampaigns = await fetch(`https://service1.nuke.co.in/sms-data?start_date=${this.startDate}&end_date=${this.endDate}`);
        if (responseCampaigns.ok) {
          this.campaigns = await responseCampaigns.json();
        }

        // Fetch Processed Data
        const responseProcessed = await fetch(`https://service1.nuke.co.in/get-mob-no-sms-delivered?start_date=${this.startDate}&end_date=${this.endDate}`);
        if (responseProcessed.ok) {
          this.processedData = await responseProcessed.json();
        }

        // Fetch Queue Data
        await this.fetchQueueData();
        // Fetch Port Usage Data
        await this.fetchPortUsageData();
      } catch (error) {
        console.error('Error applying date range:', error);
      } finally {
        this.loading = false;
      }
    },
    validateDate() {
      if (this.startDate && this.endDate && new Date(this.endDate) < new Date(this.startDate)) {
        alert('End date must be later than the start date.');
        this.validDates = false;
      } else {
        this.validDates = true;
      }
    },
    async fetchQueueData() {
      this.loading = true;
      try {
        const response = await fetch('https://service1.nuke.co.in/mob-no-sms');
        if (response.ok) {
          this.queues = await response.json();
        }
      } catch (error) {
        console.error('Fetch Queue Data Error:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchPortUsageData() {
      this.loading = true;
      try {
        const response = await fetch('https://service1.nuke.co.in/port-usage');
        if (response.ok) {
          this.ports = await response.json();
        }
      } catch (error) {
        console.error('Fetch Port Data Error:', error);
      } finally {
        this.loading = false;
      }
    },
    async resetPort(port) {
      try {
        const response = await fetch(`https://service1.nuke.co.in/reset-port/${port}`, {
          method: 'POST',
        });
        if (response.ok) {
          this.fetchPortUsageData();
        }
      } catch (error) {
        console.error('Error resetting port:', error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevQueuePage() {
      if (this.currentQueuePage > 1) this.currentQueuePage--;
    },
    nextQueuePage() {
      if (this.currentQueuePage < this.totalQueuePages) this.currentQueuePage++;
    },
    prevProcessedPage() {
      if (this.currentProcessedPage > 1) this.currentProcessedPage--;
    },
    nextProcessedPage() {
      if (this.currentProcessedPage < this.totalProcessedPages) this.currentProcessedPage++;
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    exportCsv(rid) {
      const url = `https://service1.nuke.co.in/export-csv/${rid}`;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // Open in a new tab to trigger the download
      link.click(); // Programmatically click the link to trigger the download
    },
  },
  mounted() {
    this.applyDateRange(); // Fetch initial data on mount
  },
};
</script>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';

/* White and Blue Theme */
body {
  background-color: #f0f4f8;
  font-family: 'Inter', sans-serif;
}

.main-header {
  background-color: #007bff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  border-bottom: 2px solid #0056b3;
  color: white;
}
.main-header .logo {
  display: flex;
  align-items: center;
}
.main-header .logo i {
  font-size: 30px;
  margin-right: 10px;
  color: white;
}
.main-header h1 {
  font-size: 24px;
  font-weight: bold;
}

.date-range-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.date-range-container {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.date-range-container label {
  margin-right: 10px;
  font-weight: bold;
}
.date-input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.apply-button-container {
  margin-right: 20px;
}
.apply-button {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.apply-button:disabled {
  background-color: #ccc;
}
.search-input-container {
  flex-grow: 1;
}
.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.nav-section {
  margin-bottom: 20px;
}
.nav-section button {
  margin-right: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.nav-section button:hover {
  background-color: #0056b3;
}
.nav-section i {
  margin-right: 5px;
}

.content-section {
  margin-top: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Styled Table */
.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
}
.styled-table th, .styled-table td {
  padding: 12px 15px;
  text-align: left;
}
.styled-table thead th {
  background-color: #007bff;
  color: white;
}
.styled-table tbody tr {
  border-bottom: 1px solid #ddd;
}
.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}
.styled-table tbody tr:hover {
  background-color: #f1f1f1;
}
.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #007bff;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
.pagination button {
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.pagination span {
  padding: 10px;
}
</style>
