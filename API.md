# The MC Hub - API Documentation

## Authentication & Onboarding
| Method | Endpoint | Description | Screen |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register as MC or Client | Screen 2 |
| POST | `/api/v1/auth/login` | Login to the system | Screen 2 |
| PUT | `/api/v1/mc/onboarding` | Complete MC profile setup | Screen 3 |

## Marketing & Public Discovery
| Method | Endpoint | Description | Screen |
|--------|----------|-------------|--------|
| GET | `/api/v1/public/landing` | Get landing page data (stats, hero) | Screen 1 |
| GET | `/api/v1/public/mcs` | Search and filter MCs | Screen 8 |
| GET | `/api/v1/public/mcs/:id` | Get MC public profile and showreel | Screen 9 |

## MC Dashboard & Talent Side
| Method | Endpoint | Description | Screen |
|--------|----------|-------------|--------|
| GET | `/api/v1/mc/dashboard` | Get summary stats for MC | Screen 4 |
| GET | `/api/v1/mc/calendar` | Get availability and bookings | Screen 7 |
| POST | `/api/v1/mc/calendar/blockout` | Set manual blackout dates | Screen 7 |

## Script Library & Reader
| Method | Endpoint | Description | Screen |
|--------|----------|-------------|--------|
| GET | `/api/v1/scripts` | Browse/Search scripts | Screen 5 |
| GET | `/api/v1/scripts/:id` | Get script content for reader | Screen 6 |
| POST | `/api/v1/scripts/favorite/:id` | Add script to favorites | Screen 5 |
| GET | `/api/v1/scripts/:id/download` | Download script (PDF/Docx) | Screen 5 |

## Bookings & Payments
| Method | Endpoint | Description | Screen |
|--------|----------|-------------|--------|
| POST | `/api/v1/bookings` | Create a booking & brief | Screen 10 |
| POST | `/api/v1/bookings/escrow/pay` | Secure payment via Escrow | Screen 10 |
| GET | `/api/v1/mc/wallet` | Check earnings and transactions | Screen 14 |
| POST | `/api/v1/mc/wallet/payout` | Request payout for available funds | Screen 14 |

## Communication
| Method | Endpoint | Description | Screen |
|--------|----------|-------------|--------|
| GET | `/api/v1/messages` | List conversations | Screen 11 |
| GET | `/api/v1/messages/:bookingId`| Get chat history | Screen 11 |
| POST | `/api/v1/messages` | Send message/file | Screen 11 |
| GET | `/api/v1/notifications` | Get system/payment notifications | Screen 12 |

## Feedback & Reviews
| Method | Endpoint | Description | Screen |
|--------|----------|-------------|--------|
| POST | `/api/reviews` | Submit post-event review | Screen 13 |

## Settings & Career
| Method | Endpoint | Description | Screen |
|--------|----------|-------------|--------|
| POST | `/api/user/kyc` | Upload ID and selfie for verification | Screen 15 |
| PUT | `/api/user/settings` | Update security & account info | Screen 15 |
| GET | `/api/learning` | Get career roadmap articles | Screen 16 |
| GET | `/api/resources` | Download contract templates/checklists | Screen 18 |
