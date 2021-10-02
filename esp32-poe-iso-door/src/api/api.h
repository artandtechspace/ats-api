//
// Created by Luca Schöneberg on 26.09.21.
//

#ifndef ESP32_POE_ISO_DOOR_API_H
#define ESP32_POE_ISO_DOOR_API_H

class Api {
public:
    static inline bool getCheckServer();

    static inline void postKeyToken(const char *s8_Text);


private:

    static inline void getRequest(char serverHttps);

    static inline void getRequestAuth();

    static inline void postRequestAuth();

    static inline void updateRequestAuth();

    static inline void patchRequestAuth();

};


#endif //ESP32_POE_ISO_DOOR_API_H
