export type Long = number;
export type Lat = number;

export type GeocodeLocationRequestResponse = {
    address: {
        Match_addr: string;
        LongLabel: string;
        ShortLabel: string;
        Addr_type: string;
        Type: string;
        PlaceName: string;
        AddNum: string;
        Address: string;
        Block: string;
        Sector: string;
        Neighborhood: string;
        District: string;
        City: string;
        MetroArea: string;
        Subregion: string;
        Region: string;
        RegionAbbr: string;
        Territory: "";
        Postal: "";
        PostalExt: "";
        CntryName: string;
        CountryCode: string;
        X: Long;
        Y: Lat;
        InputX: Long;
        InputY: Lat;
    };
    location: {
        x: Long;
        y: Lat;
        spatialReference: {
            wkid: number;
            latestWkid: number;
        };
    };
};
