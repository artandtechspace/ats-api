


#include "cardTypes/Desfire.h"
#include "Secrets.h"
#include "Buffer.h"

//Global Pins
#define PN_RESET 45

//Später entfernen
#define USE_DESFIRE true

//Ob das gebraucht wird
#define DESFIRE_KEY_TYPE   AES
#define DEFAULT_APP_KEY    gi_PN532.AES_DEFAULT_KEY



//Structs
struct kCard {
    byte u8_UidLength;   // UID = 4 or 7 bytes
    byte u8_KeyVersion;  // for Desfire random ID cards
    bool b_PN532_Error; // true -> the error comes from the PN532, false -> crypto error
    eCardType e_CardType;
};

//VARS
bool gb_InitSuccess = false;

Desfire gi_PN532;
DESFIRE_KEY_TYPE gi_PiccMasterKey;

//Function Prototypes
void InitReader(bool b_ShowError);

bool ReadCard(byte u8_UID[8], kCard *pk_Card);


//Wird nur evtl gebraucht
bool AuthenticatePICC(byte *pu8_KeyVersion);

void setup(){


    //Serial Init
    SerialClass::Begin(115200);
    Utils::Print("Servus Controller fahren hoch\r\n");
    gi_PN532.InitI2C(PN_RESET);


    while(!gb_InitSuccess){
        InitReader(false);
    }


    gi_PiccMasterKey.SetKeyData(SECRET_PICC_MASTER_KEY, sizeof(SECRET_PICC_MASTER_KEY), CARD_KEY_VERSION);

}


void loop(){


    delay(100);

    byte u8_UID[8];
    kCard card;

    if(ReadCard(u8_UID, &card)){
        char string[10];

        sprintf(string, "%d\r\n", card.u8_UidLength);
        Utils::Print(string);

        if (card.u8_UidLength > 5){
            Utils::Print("DESFire Card detected\r\n");




        }

        //Utils::Print("ReadCard\r\n");
    

    }
}



// Reset the PN532 chip and initialize, set gb_InitSuccess = true on success
// If b_ShowError == true -> flash the red LED very slowly
void InitReader(bool b_ShowError) {
    if (b_ShowError) {
        Utils::Print("Communication Error -> Reset PN532\r\n");
    }

    do // pseudo loop (just used for aborting with break;)
    {
        gb_InitSuccess = false;

        // Reset the PN532
        gi_PN532.begin(); // delay > 400 ms

        byte IC, VersionHi, VersionLo, Flags;
        if (!gi_PN532.GetFirmwareVersion(&IC, &VersionHi, &VersionLo, &Flags))
            break;

        char Buf[80];
        sprintf(Buf, "Chip: PN5%02X, Firmware version: %d.%d\r\n", IC, VersionHi, VersionLo);
        Utils::Print(Buf);
        sprintf(Buf, "Supports ISO 14443A:%s, ISO 14443B:%s, ISO 18092:%s\r\n", (Flags & 1) ? "Yes" : "No",
                (Flags & 2) ? "Yes" : "No",
                (Flags & 4) ? "Yes" : "No");
        Utils::Print(Buf);

        // Set the max number of retry attempts to read from a card.
        // This prevents us from waiting forever for a card, which is the default behaviour of the PN532.
        if (!gi_PN532.SetPassiveActivationRetries())
            break;

        // configure the PN532 to read RFID tags
        if (!gi_PN532.SamConfig())
            break;

        gb_InitSuccess = true;
    } while (false);

}

// Reads the card in the RF field.
// In case of a Random ID card reads the real UID of the card (requires PICC authentication)
// ATTENTION: If no card is present, this function returns true. This is not an error. (check that pk_Card->u8_UidLength > 0)
// pk_Card->u8_KeyVersion is > 0 if a random ID card did a valid authentication with SECRET_PICC_MASTER_KEY
// pk_Card->b_PN532_Error is set true if the error comes from the PN532.
bool ReadCard(byte u8_UID[8], kCard *pk_Card) {
    memset(pk_Card, 0, sizeof(kCard));

    if (!gi_PN532.ReadPassiveTargetID(u8_UID, &pk_Card->u8_UidLength, &pk_Card->e_CardType)) {
        pk_Card->b_PN532_Error = true;
        return false;
    }

//     if (pk_Card->e_CardType == CARD_DesRandom) // The card is a Desfire card in random ID mode
//     {
// #if USE_DESFIRE
//         if (!AuthenticatePICC(&pk_Card->u8_KeyVersion))
//             return false;

//         // replace the random ID with the real UID
//         if (!gi_PN532.GetRealCardID(u8_UID))
//             return false;

//         pk_Card->u8_UidLength = 7; // random ID is only 4 bytes
// #else
//         Utils::Print("Cards with random ID are not supported in Classic mode.\r\n");
//             return false;
// #endif
//     }
    return true;
}


// If the card is personalized -> authenticate with SECRET_PICC_MASTER_KEY,
// otherwise authenticate with the factory default DES key.
bool AuthenticatePICC(byte *pu8_KeyVersion) {
    if (!gi_PN532.SelectApplication(0x000000)) // PICC level
        return false;

    if (!gi_PN532.GetKeyVersion(0, pu8_KeyVersion)) // Get version of PICC master key
        return false;

    // The factory default key has version 0, while a personalized card has key version CARD_KEY_VERSION
    if (*pu8_KeyVersion == CARD_KEY_VERSION) {
        if (!gi_PN532.Authenticate(0, &gi_PiccMasterKey))
            return false;
    } else // The card is still in factory default state
    {
        if (!gi_PN532.Authenticate(0, &gi_PN532.DES2_DEFAULT_KEY))
            return false;
    }
    return true;
}