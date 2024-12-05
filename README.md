# SeekFit
This project is the result of team work as part of the project assignment of the course [Software Engineering](https://www.fer.unizg.hr/predmet/proinz) at the Faculty of Electrical Engineering and Computing, University of Zagreb.
# Description of the project
SeekFit is an innovative clothing management app designed to help users organize their wardrobe, plan outfits, and streamline the decision-making process based on weather and occasion. The app allows users to upload photos of clothing items and outfits, which are organized into a visual inventory for easy browsing. Users can categorize these items by tagging them with predefined or custom labels, such as style, weather suitability, or material, to sort and quickly access them.

SeekFit also features an AI-powered label detection system that automatically detects care labels and populates relevant information, which users can edit as needed. Outfits can be managed by assigning items to them, with the option to view, edit, or delete individual pieces. The app provides robust search and filtering options, allowing users to search for items by tags, exclude unavailable clothing, and find outfits based on item combinations.

One of SeekFit’s standout features is its integration with real-time weather data with the use of [AccuWeather Forecast API](https://developer.accuweather.com/accuweather-forecast-api/apis) [13], which helps users plan outfits tailored to the weather for the upcoming week. The app also offers secure login via [OAuth](https://developers.google.com/identity/protocols/oauth2) [7], allowing users to manage their profiles and store personal measurements. Users can access size conversion charts and create wishlists for future clothing purchases.

SeekFit enhances the social aspect of clothing management by enabling users to connect with friends, send borrowing requests for clothing items, and view their friends’ wardrobes. Additionally, users can create and manage up to five group chats for discussions or sharing wardrobe ideas. The app sends push notifications for new friend requests or group chat activities, keeping users engaged and connected.

In summary, SeekFit is a comprehensive solution for managing wardrobes, planning outfits, staying connected with friends, and taking advantage of real-time weather-based suggestions, making it an essential tool for fashion enthusiasts.

# User instructions
 
# Functional Requirements
Here are the core functionalities of this project:

- Users can take pictures directly within the application using the device's camera.
- Users can upload photos from their device’s gallery.
- Users can upload photos of individual clothing pieces.
- Users can upload photos of complete outfits.
- A gallery view displays all the user's uploaded clothing pieces.
- A gallery view displays all the user's uploaded outfits.
- Users can view detailed information about a clothing piece by selecting it in the gallery view.
- Users can view detailed information about an outfit by selecting it in the gallery view.
- Users can add predefined tags (e.g., weather, style) to outfits.
- Users can manage login through an external authentication service.
- Real-time weather data for the user's current location is retrieved from a weather API and displayed in the calendar.
- When scheduling outfits, users are provided with a list of outfits suitable for the forecasted weather based on the outfits' predefined weather tags.
- Logged-in users can add other users to their friends list.
- Push notifications are sent to logged-in users when they receive friend requests.

All functional requirements (essential and additional) can be read [here](https://github.com/TeaWhoYou/SeekFit/wiki/Functional-Requirements).

# Technologies
|**Category**|**Used Technology**|
|-----------------------|----------------------|
|**Mobile Development Framework**|[React Native](https://reactnative.dev/docs/getting-started) [4], [Expo](https://docs.expo.dev/guides/overview/) [5]|
|**Mobile Development IDE**|[Android Studio](https://developer.android.com/develop) [3]|
|**Database**|[PostgreSQL](https://www.postgresql.org/) [15] for structured data and [MongoDB](https://www.mongodb.com/) [14] for unstructured|
|**Image Storage**|local file system|
|**User Authentication**|[OAuth](https://developers.google.com/identity/protocols/oauth2) [7]|
|**Push Notifications**|[Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) [12]|
|**Weather API**|[OpenWeatherMap API](https://developer.accuweather.com/accuweather-forecast-api/apis) [13]|
|**Camera & Media Access**|[React Native Camera](https://react-native-camera.github.io/react-native-camera/docs/rncamera) [16] |
|**Scheduling & Calendar Interface**|[React Native Calendar](https://www.npmjs.com/package/react-native-calendars) [17]|
|**Deployment**|[Kubernetes](https://kubernetes.io/docs/home/) [8] and [DigitalOcean](https://www.digitalocean.com/) [18]|

#Installation

# Team members
- Tia Rapo
- Cristian Rotar
- Bartul Kajmak
- Mateusz Juszczak
- Anna Zalesińska
- Kyrylo Rotan

# Contributions
>The rules depend on the organization of the team and are often separated in CONTRIBUTING.md



# 📝 Code of Conduct [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
As students, you are surely familiar with the minimum acceptable behavior defined in [CODE OF CONDUCT FOR STUDENTS OF THE FACULTY OF ELECTRICAL ENGINEERING AND COMPUTER SCIENCES OF THE UNIVERSITY OF ZAGREB](https://www.fer.hr/_download/repository/Kodeks_ponasanja_studenata_FER-a_procisceni_tekst_2016%5B1%5D.pdf), and additional instructions for teamwork in the subject [Program Engineering] (https://www.fer.hr).
We expect you to abide by the [IEEE Code of Ethics](https://www.ieee.org/about/corporate/governance/p7-8.html) which has an important educational function with the purpose of setting the highest standards of integrity, responsible behavior and ethical behavior in professional activities. Thus, the professional community of software engineers defines general principles that define moral character, making important business decisions and establishing clear moral expectations for all members of the community.

A code of conduct is a set of enforceable rules that serve to clearly communicate expectations and requirements for community/team work. It clearly defines obligations, rights, unacceptable behavior and corresponding consequences (in contrast to the code of ethics). One of the widely accepted codes of conduct for working in the open source community is given in this repository.
>### Improve team functioning:
>* define how work will be divided among group members
>* agree on how the group will communicate with each other.
>* don't waste time on agreements on which the group will resolve disputes, apply the standards!
>* we implicitly assume that all members of the group will follow the code of conduct.

>### Report a problem
>The worst thing that can happen is that someone stays silent when there are problems. There are several things you can do to best resolve conflicts and issues:
>* Contact me directly [email](mailto:vlado.sruk@fer.hr) and we will do everything in our power to find out in full confidence what steps we need to take to solve the problem.
>* Talk to your assistant as he has the best insight into team dynamics. Together, you will learn how to resolve conflict and how to avoid further impact on your work.
>* If you feel comfortable, discuss the problem directly. Minor incidents should be dealt with directly. Take the time to speak privately with the affected team member and trust in honesty.

# 📝 License
Valid (1)
[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

> ### Note:
>
> All packages are distributed under their own licenses.
> All materials used (images, models, animations, ...) are distributed under their own licenses.

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: https://creativecommons.org/licenses/by-nc/4.0/deed.hr
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

Original [![cc0-1.0][cc0-1.0-shield]][cc0-1.0]
>
>>COPYING: All the content within this repository is dedicated to the public domain under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication.
>
[![CC0-1.0][cc0-1.0-image]][cc0-1.0]

[cc0-1.0]: https://creativecommons.org/licenses/by/1.0/deed.en
[cc0-1.0-image]: https://licensebuttons.net/l/by/1.0/88x31.png
[cc0-1.0-shield]: https://img.shields.io/badge/License-CC0--1.0-lightgrey.svg

### Repository Licensing References
