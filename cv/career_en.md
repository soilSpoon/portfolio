# Career Description — Daehee Lee

A document detailing the technical challenges and solutions encountered in each project.

---

## 1. EveryDrone — Drone Simulation Platform

**Period**: 2025.03 - 2026.01
**Company**: Everysim Inc. | Head of Product Development
**Tech**: C++, Nest.js, Next.js, WebAssembly

### Challenge 1: Running C++ Simulation Engine in the Browser

**Situation**: There was a requirement to run the existing C++ drone simulation engine in the browser without any separate installation.

**Solution**: Compiled the C++ code to WebAssembly using Emscripten, enabling near-native simulation performance in the browser environment. Designed a data exchange interface between JavaScript and C++ so that the frontend could control simulation parameters.

### Challenge 2: Full-Stack Product Architecture Design

**Situation**: One developer needed to lead frontend, backend, and simulation engine domains while maintaining a consistent architecture.

**Solution**: Separated the Nest.js backend API into modular units and designed a type-sharing structure with the Next.js frontend to minimize interface mismatches between domains.

---

## 2. Attendance Note — Attendance & Payroll Management SaaS

**Period**: 2020.08 - 2025.03
**Company**: CM Universe Co., Ltd. | Full-Stack Developer
**Tech**: React, React Native, TypeScript, Laravel, Redis, MySQL, AWS

### Challenge 1: API Response Delays During Bulk Payroll Processing

**Situation**: API response times spiked dramatically when calculating payroll for thousands of workers simultaneously during settlement periods, causing user complaints. The attendance calculation logic was complex, and identical calculations were being called redundantly across multiple APIs.

**Solution**: Introduced Redis caching to store repeated calculation results and analyzed method/function call structures to eliminate redundant computations. At the query level, resolved N+1 problems and switched to Eager Loading to reduce database call frequency. As a result, payroll API response times improved significantly.

### Challenge 2: Legacy Code Accumulation from Project Growth

**Situation**: After 4+ years of operation, code duplication and inconsistency from the early stages accumulated, causing frequent side effects when adding new features.

**Solution**: Introduced a design system to standardize UI components and consolidated duplicate or similar functions/libraries. Wrote test code incrementally during refactoring to ensure existing behavior was preserved while improving code structure. Set up lint tools to unify coding styles across the team and prevent errors proactively.

### Challenge 3: CI Pipeline Slowdown

**Situation**: As the project grew, Github Actions CI became increasingly slow, lengthening the development feedback loop.

**Solution**: Deployed self-hosted runners to directly manage the build environment and applied dependency caching to eliminate repeated installation time. Analyzed CI bottlenecks, removed unnecessary steps, and applied parallel execution.

### Challenge 4: Complexity of 5-Tier Permission System

**Situation**: The B2B2C structure had 5 permission tiers — admin, labor firm, business owner, manager, and worker — requiring different data access and feature controls per user level on the same APIs and screens.

**Solution**: Centralized permission logic on the backend using Policy/Gate patterns and implemented permission-based component rendering on the frontend to handle per-tier UI branching.

### Challenge 5: Open-Source Library Limitations

**Situation**: Libraries in use occasionally failed to meet the project's specific requirements.

**Solution**: Directly analyzed library source code to understand the inner workings and submitted PRs with necessary modifications to contribute to open source. In urgent cases, forked and customized versions were used while maintaining tracking of upstream changes.

---

## 3. GSS — Steel Plate Defect Analysis System

**Period**: 2019.12 - 2023.11
**Company**: CM Universe Co., Ltd. | Full-Stack Developer (Led MES secondary process)
**Tech**: Electron, TypeScript, React, Next.js, Ant Design, Laravel, MySQL, WebSocket

### Challenge 1: Real-Time High-Volume Socket Data Processing Performance

**Situation**: The volume of steel plate defect data arriving via WebSocket in real time was enormous, and client-side data processing speed could not keep up with the ingestion rate.

**Solution**: Added a preprocessing stage to filter unnecessary items from incoming data, and applied memoization to prevent recalculation of identical data. Analyzed function call chains to eliminate redundant calls and switched to batch processing to improve efficiency.

### Challenge 2: Disk Usage Growth from Intermediate Data Storage

**Situation**: All intermediate stages of data transformation from raw data to final processed data were being stored, causing continuously increasing disk usage.

**Solution**: Analyzed the data flow to identify stages where intermediate storage was unnecessary, switched to a pipeline approach where intermediate data was processed only in memory without being persisted. Only final results were permanently stored, significantly reducing disk usage.

### Challenge 3: Complexity of Coil Grading Algorithm

**Situation**: Final coil grading needed to consider various factors including 2D coordinates of defects, size, and grade. Conditional branching was complex, and criteria varied by steel mill.

**Solution**: Abstracted the grading logic into a rule engine format, separating conditions from outcomes. Made it possible to manage each steel mill's criteria through configuration, allowing grading standards to be changed without code modifications.

### Challenge 4: Integration with Existing Legacy MES System

**Situation**: Secondary process analysis functionality needed to be added alongside an already operational MES project, with limited understanding of the existing system.

**Solution**: Systematically analyzed the existing codebase to document data flows and architecture. Implemented the new functionality as an independent module with minimal changes to the existing system.

---

## 4. ESM — Hardware Monitoring Service

**Period**: 2020.07 - 2020.12
**Company**: CM Universe Co., Ltd. | Full-Stack Developer
**Tech**: Electron, TypeScript, React, SCSS, Laravel, MySQL, SNMP, ICMP, SSH

### Challenge 1: Integrating Multi-Protocol Data Collection

**Situation**: Different hardware targets supported different protocols (SNMP, ICMP, SSH, etc.), requiring separate data collection logic for each.

**Solution**: Abstracted per-protocol collectors behind a common interface so that the upper layer could process data without being aware of the protocol type. Applied a plugin architecture where adding a new protocol only requires implementing a collector.

### Challenge 2: Per-Client Customization Requirements

**Situation**: Each client had different monitoring dashboard and alert condition requirements, necessitating code changes every time.

**Solution**: Separated monitoring items, dashboard layouts, and alert rules into configuration files, redesigning into an independent, reusable module structure that could accommodate per-client requirements without code modifications.

---

## 5. IP Scanner — Network IP/Port Scanning Tool

**Period**: 2019.10 - 2019.11
**Company**: CM Universe Co., Ltd. | Windows Native Developer
**Tech**: C#, WPF, Golang, FFI

### Challenge: Performance Limitations of C# Async Processing

**Situation**: C# async processing performance was insufficient when scanning large IP ranges, resulting in excessively long total scan times.

**Solution**: Wrote the performance-critical network scanning logic in Golang to leverage goroutine-based parallel processing. Implemented a hybrid architecture where a Golang-built DLL is called from the C# UI via FFI (Foreign Function Interface), significantly improving scan speed.

---

## 6. SSMT — Server Monitoring Service

**Period**: 2018.11 - 2019.02
**Company**: CM Universe Co., Ltd. | Windows Native Developer
**Tech**: C#, WPF, SQLite, NSIS

### Challenge: Network Load from Multi-Server Monitoring

**Situation**: Network load increased linearly as the number of monitored servers grew due to polling-based communication.

**Solution**: Dynamically adjusted polling intervals based on server state change frequency and optimized the communication protocol to minimize response data when there were no changes. Cached monitoring data locally in SQLite so that recent data remained accessible even during network disconnections.
