FROM node

# Install dependencies for backend
WORKDIR /usr/src/app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm install

# Install dependencies for frontend
WORKDIR /usr/src/app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Set the timezone
ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Build the backend
WORKDIR /usr/src/app/backend
COPY ./backend/ .
RUN npm run build

# Build the frontend
WORKDIR /usr/src/app/frontend
COPY ./frontend/ .
RUN npm run build

# Link the data directory into the routes folder of the backend
WORKDIR /usr/src/app/backend
RUN ln -s /stor routes

EXPOSE 8080

CMD [ "npm", "run", "serve" ]
