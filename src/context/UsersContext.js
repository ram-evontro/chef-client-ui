import React, {useCallback, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {useLocation} from "@reach/router";
import Cookies from "js-cookie";
import * as _ from "lodash";
import useRazorpay from "react-razorpay";
import SuccessFullPopUp from "../components/SuccessFullPopUp";
import {toast} from 'react-toastify';
import configuration from '../configuration';

const defaultState = {
    data: {},
    toggleDark: () => {
    },
}

const UsersContext = React.createContext(defaultState)

const UsersProvider = (props) => {
    const priveeRazorpay = useRazorpay();
    const SupperClubRazorpay = useRazorpay();
    const path = useLocation();
    const currentPath = path.pathname.split("/")?.[1];
    const baseUrl = configuration.API_BASEURL;

    const [userData, setUserData] = useState();
    const [addOnsData, setAddOnsData] = useState();
    const [userId, setUserId] = useState();
    const [eventId, setEventId] = useState();
    const [supperClubDetailId, setSupperClubDetailId] = useState();
    const cookieValue = Cookies?.get('bookingId');
    const bookingId = cookieValue?.replaceAll('"', '');
    const summaryBookingId = cookieValue?.replaceAll('"', '');
    const supperClubBookingIdCookieValue = Cookies?.get('supperClubBookingId');
    const supperClubBookingId = supperClubBookingIdCookieValue?.replaceAll('"', '')
    const [isSupperBookingStatus, setIsSupperBookingStatus] = useState(false);
    const [paymentVerification, setPaymentVerification] = useState(false);
    const [supperClubRazorpay, setSupperClubRazorpay] = useState();
    const [isConfirm, setIsConfirm] = useState(false);
    const [customerDetailsPaymentCalculation, setCustomerDetailsPaymentCalculation] = useState();
    const [ customerMobileNumber, setCustomerMobileNumber ] = useState('')
    //for submitting forms
    const [contactUsData, setContactUsData] = useState({})
    const [isContactUsData, setIsContactUsData] = useState(false)
    const [joinChefData, setJoinChefData] = useState({})
    const [isJoinChefData, setIsJoinChefData] = useState(false)

    const [callMobileNumber, setCallMobileNumber] = useState();
    const [mealData, setMealData] = useState();
    const [commonCityData, setCommonCityData] = useState();
    const [mealTypeData, setMealTypeData] = useState();
    const [partnerMenuData, setPartnerMenuData] = useState();
    const [partnerCityData, setPartnerCityData] = useState();
    const eventIdCookieValue = Cookies.get('eventIdValue');
    const PaymentEventId = eventIdCookieValue?.replaceAll('"', '')
    const superClubDetailIdCookieValue = Cookies.get('superClubDetailId');
    const superClubDetailId = superClubDetailIdCookieValue?.replaceAll('"', '')
    const eventDataCookieValue = Cookies?.get('eventData');
    const [eventDetailsData, setEventDetailsData] = useState();
    const [adPaymentData, setAdPaymentData] = useState()
    const [bsPaymentData, setBsPaymentData] = useState();
    const [supperClubPaymentData, setSupperClubPaymentData] = useState()
    const [supperClubConfirmPaymentData, setSupperClubConfirmPaymentData] = useState();
    const [isCoupon, setIsCoupon] = useState(false);
    const [isSupperClubCoupon, setIsSupperClubCoupon] = useState(false);
    const [voucher, setVoucher] = useState('');
    const [bookingSuccessOpen, setBookingSuccessOpen] = useState(false);
    const [priveePayment, setPriveePayment] = useState(false)
    const [supperClubPayment, setSupperClubPayment] = useState(false)
    const [chefFormData, setChefFormData] = useState({})
    const [isChefData, setIsChefData] = useState(false)
    
    const forDinersValue = Cookies?.get('eventDinners')
    const numberOfDinner = parseInt(forDinersValue?.replaceAll('"', ''));
    const forCoursesValue = Cookies?.get('eventCourses')
    const numberOfCourses = parseInt(forCoursesValue?.replaceAll('"', ''));
    const [isBecomePartner, setIsBecomePartner] = useState(false)
    const [becomePartnerData, setBecomePartnerData] = useState({})
    const [isUpdateBooking, setIsUpdateBooking] = useState(false)
    const [addonsId, setAddonsId] = useState([])
    const selectedAddonsId = !_.isEmpty(addonsId) ? addonsId.map((item) => item.id) : [];
    const supperClubExperienceSeats = Cookies?.get('supperClubExperienceSeats');
    const experienceNumberOfSeats = parseInt(supperClubExperienceSeats?.replaceAll('"', ''));
    const supperClubExperienceTables = Cookies?.get('supperClubExperienceTables');
    const experienceNumberOfTables = parseInt(supperClubExperienceTables?.replaceAll('"', ''));

    const [isScheduleCall, setIsScheduleCall] = useState(false)
    const [scheduleCallData, setScheduleCallData] = useState();
    const [partnerId, setPartnerId] = useState();
    const [partnerCityId, setPartnerCityId] = useState();
    const [successOpen, setSuccessOpen] = useState(false);
    const [scheduleCallOpen, setScheduleCallOpen] = useState(false);
    const [becomePatronData, setBecomePatronData] = useState({});
    const [occasionData, setOccasionData] = useState({});
    const [memberShipTypeData, setMemberShipTypeData] = useState({});
    const [isBecomePatron, setIsBecomePatron] = useState('');
    const [personalDetailsPaymentCalculation, setPersonalDetailsPaymentCalculation] = useState('');
    const membershipIdCookie = Cookies?.get('memberShipId');
    const membershipId = membershipIdCookie?.replaceAll('"', '');

    const [isGstSubmitData, setIsGstSubmitData] = useState(false)
    const [gstData, setGstData] = useState({})
    

    const [dinersMaxNumber, setDinersMaxNumber] = useState('');
    const [dinersMinNumber, setDinersMinNumber] = useState('');

    const [dinersMaxData, setDinersMaxData] = useState({});
    const [dinersMinData, setDinersMinData] = useState({});

    console.log("becomePatronData========",becomePatronData)
    useEffect(() => {
        if (eventDataCookieValue) {
            setEventDetailsData(JSON.parse(eventDataCookieValue))
        }
    }, [eventDataCookieValue]);


    useEffect(() => {
        if (userId && currentPath === 'chef-details') {
            axios.get(baseUrl + '/users/' + userId).then(result => {
                setUserData(result.data)
            })
        } else if (eventId && currentPath === 'event-details') {
            axios.get(baseUrl + `/menu/` + eventId).then(result => {
                setUserData(result.data);
                localStorage.setItem('privateEventData', JSON.stringify(result.data));
                const dinersMaxValue = Math.max.apply(Math, result.data.prices.map(function(o) {
                    return o.max_diner;
                }));
                const dinersMinValue = Math.min.apply(Math, result.data.prices.map(function(o) {
                    return o.min_diner;
                }));
              
                const dinersMaxGet = dinersMaxValue && result.data.prices.filter((item)=>{
                  return item.max_diner===dinersMaxValue
                })
              
                const dinersMinGet = dinersMinValue && result.data.prices.filter((item)=>{
                  return item.min_diner===dinersMinValue
                })
              
                const dinersMaxObject = dinersMaxGet && dinersMaxGet?.[0]
                const dinersMinObject = dinersMinGet && dinersMinGet?.[0]
                setDinersMaxNumber(dinersMaxValue);
                setDinersMinNumber(dinersMinValue);
                setDinersMaxData(dinersMaxObject);
                setDinersMinData(dinersMinObject);

                console.log('results in dinersMaxObject', dinersMaxObject)
                console.log('results in dinersMinObject', dinersMinObject)
            })
        } else if (supperClubDetailId && currentPath === 'ticketed-detail') {
            axios.get(baseUrl + '/event/' + supperClubDetailId).then(result => {
                setUserData(result.data);
                localStorage.setItem('ticketedEventData', JSON.stringify(result.data));
            })
        } else if (currentPath === 'private-viewmore') {
            axios.get(baseUrl + '/menu/frontend?limit=1000').then(result => {
                setUserData(result.data)
            })
        } else if (currentPath === 'addons' && bookingId) {
            axios.get(baseUrl + '/addon_category_master/all').then(result => {
                setAddOnsData(result.data)
            })
            axios.post(baseUrl + '/booking/calculate/' + bookingId, {}).then((response) => {
                if (response.status === 200) {
                    setAdPaymentData(response.data)
                    Cookies.set('adsPaymentInfo', JSON.stringify(response.data));
                }
            })
        } else if (isConfirm) {
            axios.post(baseUrl + '/booking/confirm/' + bookingId).then((response) => {
                if (response.status === 200) {
                    localStorage.setItem('privateBookingOrderNumber', JSON.stringify(response.data.order_number));
                    const options = {
                        key: response?.data?.razorpay_key,
                        currency: "INR",
                        name: "Chefs-à-Porter",
                        order_id: response?.data?.razorpay_order_id,
                        description: "Test Transaction",
                        image: "https://chefsaporter.com/assets/img/logo_black.svg",
                        theme: {color: "#C6A87D", fontFamily: "ProximaNovaA-Regular"},
                        handler: (response) => {
                            if (response) {
                                localStorage.setItem('privatePaymentNumber', JSON.stringify(response.razorpay_payment_id));
                                setIsConfirm(false);
                                axios.post(baseUrl +'/booking/verifypayment/' + summaryBookingId, {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                })
                                    .then((response) => {
                                        setBookingSuccessOpen(true)
                                        if (response.status === 200) {
                                            Cookies.set(
                                                "paymentVerificationData",
                                                JSON.stringify(response.data)
                                            );
                                        }
                                    });
                            }
                        },
                        prefill: {
                            contact: customerMobileNumber && customerMobileNumber,
                          },
                    };
                    console.log('userData',userData)
                    const rzpay = new priveeRazorpay(options);
                    rzpay.open();
                } else {
                    rzpay.on("payment.failed", function (response) {
                        console.log("fails", response);
                    });
                }
                setIsConfirm(false);
                // localStorage.removeItem('priveePaymentInfo');
            })
        } else if (isCoupon) {
            axios.post(baseUrl + '/booking/calculate/' + summaryBookingId, {
                voucher: voucher
            }).then((response) => {
                if (response.status === 200) {
                    setBsPaymentData(response.data);
                    // localStorage.setItem('priveePaymentInfo', JSON.stringify(response.data));
                    Cookies.set("priveePaymentInfo", JSON.stringify(response.data));
                    setIsCoupon(false);
                }
            })

        } else if (isCoupon !== true && priveePayment) {
            axios.post(baseUrl + '/booking/calculate/' + summaryBookingId).then((response) => {
                if (response.status === 200) {
                    setBsPaymentData(response.data)
                    localStorage.setItem('priveePaymentInfo', JSON.stringify(response.data));
                }
            })
            setPriveePayment(false)
        } else if (isContactUsData) {
            axios.post(baseUrl + '/contact_us', {
                name: contactUsData.name,
                email: contactUsData.email,
                mobile: contactUsData.contactNumber,
                cover_letter: contactUsData.coverLetterMessage,
            }).then((response) => {
                console.log("========success")
                toast.success('Response submitted successfully');
                setIsContactUsData(false)
            })

        } else if (isBecomePartner && becomePartnerData) {
            axios.post(baseUrl + '/partner', {
                partner_as: partnerId,
                name: becomePartnerData.name,
                email: becomePartnerData.email,
                mobile: becomePartnerData.contactNumber,
                city: partnerCityId,
                brand_name: becomePartnerData.brandName,
                instagram_profile_link: becomePartnerData.instagramLink,
                other_link: [becomePartnerData.otherLinks],
                about_your_brand: becomePartnerData.brandMessage,
                why: becomePartnerData.chefsMessage,
                // work_samples: becomePartnerData.workSampleFile,
                work_samples: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi"
            }).then((response) => {
                setSuccessOpen(true);
            })
            setIsBecomePartner(false);
        } else if (isScheduleCall) {
            axios.post(baseUrl + '/call_schedule', {
                date_time: scheduleCallData.day,
                mobile: scheduleCallData.contactNumber,
                query: scheduleCallData.queryMessage
            }).then((response) => {
                setScheduleCallOpen(false);
                setSuccessOpen(true);
            })
            setIsScheduleCall(false)
        } else if (isJoinChefData) {
            axios.post(baseUrl + '/users/requestjoin', {
                name: joinChefData.name,
                email: joinChefData.email,
                mobile: joinChefData.contactNumber,
                resume: joinChefData.resume,
                cover_letter: joinChefData.coverLetterMessage,
            }).then((response) => {
                setSuccessOpen(true);
                setIsJoinChefData(false);
            })
        } else if (isChefData) {
            axios.post(baseUrl + '/booking/creatediners/' + supperClubBookingId, {
                diners: [
                    {
                        name: chefFormData?.name,
                        mobile: chefFormData?.contact,
                        meal_type: chefFormData?.foodPreference,
                        email: chefFormData?.email,
                    }
                ]
            })
            setIsChefData(false);
        } else if (isBecomePatron) {
            axios.post(baseUrl + '/patron/', {
                type: becomePatronData?.enrollOrRenew,
                membership_type: becomePatronData?.membershipType,
                name: becomePatronData?.name,
                company_name: becomePatronData?.brandName,
                occassion: becomePatronData?.occupation,
                email: becomePatronData?.email,
                mobile: becomePatronData?.contactNumber,
                date_of_birth: becomePatronData?.dateOfBirth,
                anniverary_date: becomePatronData?.anniversaryDate,
                patron_master: membershipId,
            }).then((response) => {
                toast.success('Response submitted successfully');
                setIsBecomePatron(false);
            })
        } else if (currentPath === 'ticketed-booking-summary' && supperClubBookingId) {
            axios.post(baseUrl + '/booking/calculate/' + supperClubBookingId, {
                common_menu: eventId,
            }).then((response) => {
                if (response.status === 200) {
                    setSupperClubPaymentData(response.data);
                }
            })
        } else if (isSupperBookingStatus) {
            axios.post(baseUrl + '/booking/confirm/' + supperClubBookingId).then((response) => {
                if (response.status === 200) {
                    localStorage.setItem('scBookingOrderNumber', JSON.stringify(response.data.order_number));
                    const options = {
                        key: response?.data?.razorpay_key,
                        currency: "INR",
                        name: "Chefs-à-Porter",
                        order_id: response?.data?.razorpay_order_id,
                        description: "Test Transaction",
                        image: "https://chefsaporter.com/assets/img/logo_black.svg",
                        theme: {color: "#C6A87D", fontFamily: "ProximaNovaA-Regular"},
                        handler: (response) => {
                            if (response) {
                                localStorage.setItem('scPaymentNumber', JSON.stringify(response.razorpay_payment_id));
                                setIsSupperBookingStatus(false);
                                axios.post(baseUrl +'/booking/verifypayment/' + supperClubBookingId, {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                })
                                    .then((response) => {
                                        if (response.status === 200) {
                                            setBookingSuccessOpen(true)
                                            Cookies.set(
                                                "paymentVerificationData",
                                                JSON.stringify(response.data)
                                            );
                                        }
                                    });
                            }
                        },
                        prefill: {
                            contact: customerMobileNumber && customerMobileNumber,
                          },
                    };
                    const rzpay = new SupperClubRazorpay(options);
                    rzpay.open();
                } else {
                    rzpay.on("payment.failed", function (response) {
                        console.log("fails", response);
                    });
                }
                setIsSupperBookingStatus(false)
                // localStorage.removeItem('sprClubPaymentInfo');
            })
        } else if (isSupperClubCoupon) {
            axios.post(baseUrl + '/booking/calculate/' + supperClubBookingId, {
                voucher: voucher
            }).then((response) => {
                if (response.status === 200) {
                    setSupperClubConfirmPaymentData(response.data)
                    localStorage.setItem('sprClubPaymentInfo', JSON.stringify(response.data));
                    setIsSupperClubCoupon(false)
                }
            })
        } else if (isSupperClubCoupon !== true && supperClubPayment) {
            axios.post(baseUrl + '/booking/calculate/' + supperClubBookingId).then((response) => {
                if (response.status === 200) {
                    setSupperClubConfirmPaymentData(response.data);
                    localStorage.setItem('sprClubPaymentInfo', JSON.stringify(response.data));
                }
            })
            setSupperClubPayment(false);
        } else if (superClubDetailId && currentPath === 'personal-details') {
            axios.post(baseUrl + '/booking/calculatepayment/', {
                id: superClubDetailId,
                type: 'supper_club',
                seats: experienceNumberOfSeats,
                seats_chefs_table: experienceNumberOfTables
            }).then((response) => {
                if (response.status === 200) {
                    Cookies.set('PersonalDetailsPaymentCalculation', JSON.stringify(response.data));
                }
            })
        } else if (PaymentEventId && currentPath === 'customer-details') {
            axios.post(baseUrl + '/booking/calculatepayment/', {
                id: PaymentEventId,
                type: "privee",
                diner: numberOfDinner,
                courses: numberOfCourses,
            }).then((response) => {
                if (response.status === 200) {
                    setCustomerDetailsPaymentCalculation(response.data)
                    // Cookies.set('CPaymentInfo', JSON.stringify(response.data));
                }
            })
        } else if (currentPath === 'become-partner') {
            axios.get(baseUrl + '/partner_master/all', {
                headers: {
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTllZDA0M2VlNGFjZWIwNjI3ZDk3MTciLCJpYXQiOjE3NzIxMzIwMjgsImV4cCI6MTc3MjEzNTYyOCwidHlwZSI6ImFjY2VzcyJ9.KRp2myW6-WLEAzNt9nvibXarkLl3b7FxK2FpLSUbnVo`
                }
            }).then((response) => {
                if (response.status === 200) {
                    setPartnerMenuData(response.data)
                }
            })
            axios.get(baseUrl + '/city/all', {
                headers: {
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTllZDA0M2VlNGFjZWIwNjI3ZDk3MTciLCJpYXQiOjE3NzIxMzIwMjgsImV4cCI6MTc3MjEzNTYyOCwidHlwZSI6ImFjY2VzcyJ9.KRp2myW6-WLEAzNt9nvibXarkLl3b7FxK2FpLSUbnVo`
                }
            }).then((response) => {
                if (response.status === 200) {
                    setPartnerCityData(response.data)
                }
            })
        }
        if (path.pathname === "/") {
            axios.get(baseUrl + '/cms/footer').then(result => {
                setCallMobileNumber(result.data.footer.footer.mobile)
                Cookies.set('callMobileNumber', JSON.stringify(result.data.footer.footer.mobile));
            })
        }
        if (path.pathname === '/' || currentPath === "private" || currentPath === "private-viewmore" || currentPath === 'event-details' || currentPath === 'customer-details') {
            axios.get(baseUrl +'/meal_times/all').then(result => {
                setMealData(result.data)
            })
            axios.get(baseUrl +'/city/all').then(result => {
                setCommonCityData(result.data)
            })
        }
        if (currentPath === "ticketed") {
            axios.get(baseUrl +'/city/all').then(result => {
                setCommonCityData(result.data)
            })
        }
        if (currentPath === "personal-details") {
            axios.get(baseUrl +'/meal_types/all').then(result => {
                setMealTypeData(result.data)
            })
        }
        if (currentPath === "become-patron") {
            axios.get(baseUrl +'/occasion_master/all').then(result => {
                setOccasionData(result.data)
            });
            axios.get(baseUrl +'/partner_master/all').then(result => {
                setMemberShipTypeData(result.data)
            })
        }
        if (isUpdateBooking) {
            axios.patch(baseUrl + '/booking/' + bookingId, {
                addons: selectedAddonsId
            }).then((response) => {
                if (response.status === 200) {
                    setIsUpdateBooking(false);
                }
            })
        }
        if (isGstSubmitData && currentPath === 'customer-details') {
            axios.patch(baseUrl + '/booking/' + bookingId, {
                customer_gst: gstData
            }).then((response) => {
                if (response.status === 200) {
                    setIsUpdateBooking(false);
                    console.log('response data',response.data)
                }
            })
        }
        if (currentPath === 'customer-details' && isGstSubmitData && bookingId) {
            axios.patch(baseUrl + '/booking/' + bookingId, {
                customer_gst: gstData
            }).then((response) => {
                if (response.status === 200) {
                    setIsUpdateBooking(false);
                    console.log('response data',response.data)
                }
            })
        }
        if (currentPath === 'ticketed-booking-summary' && supperClubBookingId && isGstSubmitData) {
            axios.patch(baseUrl + '/booking/' + supperClubBookingId, {
                customer_gst: gstData,
            }).then((response) => {
                if (response.status === 200) {
                    console.log('response data',response.data)
                }
            })
        }
    }, [customerMobileNumber, isBecomePatron, isUpdateBooking, isScheduleCall, isBecomePartner, isChefData, isGstSubmitData, isConfirm, isSupperClubCoupon, isCoupon, userId, eventId, currentPath, supperClubDetailId, bookingId, summaryBookingId, contactUsData, isContactUsData, isJoinChefData, joinChefData, supperClubBookingId, isSupperBookingStatus, paymentVerification, successOpen])
    isGstSubmitData
    const {children} = props;

    return (
        <UsersContext.Provider
            value={{
                dinersMaxNumber,
                dinersMinNumber,
                dinersMaxData,
                dinersMinData,
                setDinersMaxNumber,
                setDinersMinNumber,
                setDinersMaxData,
                setDinersMinData,
                setCustomerMobileNumber,
                userData,
                setUserId,
                setEventId,
                eventId,
                setSupperClubDetailId,
                setContactUsData,
                setIsContactUsData,
                setJoinChefData,
                setIsJoinChefData,
                setIsSupperBookingStatus,
                supperClubDetailId,
                setPaymentVerification,
                callMobileNumber,
                mealData,
                mealTypeData,
                addOnsData,
                adPaymentData,
                bsPaymentData,
                supperClubPaymentData,
                supperClubConfirmPaymentData,
                voucher,
                setVoucher,
                setIsCoupon,
                setIsSupperClubCoupon,
                supperClubRazorpay,
                setIsConfirm,
                isConfirm,
                bookingSuccessOpen,
                setBookingSuccessOpen,
                setPriveePayment,
                setSupperClubPayment,
                setChefFormData,
                setIsChefData,
                setIsBecomePartner,
                setBecomePartnerData,
                setIsScheduleCall,
                setScheduleCallData,
                partnerMenuData,
                setPartnerId,
                setIsUpdateBooking,
                setAddonsId,
                addonsId,
                partnerCityData,
                setPartnerCityId,
                commonCityData,
                successOpen,
                setSuccessOpen,
                customerDetailsPaymentCalculation,
                scheduleCallOpen, setScheduleCallOpen,
                becomePatronData, setBecomePatronData,
                isBecomePatron, setIsBecomePatron,
                occasionData,memberShipTypeData,
                isGstSubmitData,
                setIsGstSubmitData,
                gstData,
                setGstData,
                personalDetailsPaymentCalculation,
                setPersonalDetailsPaymentCalculation
            }}
        >
            {children}
        </UsersContext.Provider>
    )
}
export default UsersContext

export {UsersProvider}