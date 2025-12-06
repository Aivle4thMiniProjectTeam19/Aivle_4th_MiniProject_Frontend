// src/pages/BookListPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Box,
    Stack,
    Chip,
} from "@mui/material";
import api from "../app/axios";

function BookListPage() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);   // 로딩 상태
    const [error, setError] = useState("");         // 에러 메시지

    async function fetchBooks() {
        try {
            // 검색 조건 없으면 그냥 전체 조회
            const res = await api.get("/books");

            // API 스펙: { status, message, data: [...] }
            setBooks(res.data.data || []);
        } catch (e) {
            // 404, 500 경우에 message 내려줄 거라 그거 사용
            const msg = e.response?.data?.message || "도서 목록을 불러오지 못했습니다.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;
    if (error)
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="error" fontWeight={700} gutterBottom>
                    {error}
                </Typography>
                <Button variant="outlined" onClick={fetchBooks}>
                    다시 시도하기
                </Button>
            </Box>
        );

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" mb={2} gap={2}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>
                        도서 목록
                    </Typography>
                    <Typography color="text.secondary">
                        최신 등록 도서들을 카드로 확인하고 바로 상세 페이지로 이동하세요.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/books/new")}
                    sx={{ alignSelf: "flex-start" }}
                >
                    신규 도서 등록
                </Button>
            </Stack>

            <Grid container spacing={2.5}>
                {books.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.bookId}>
                        <Card
                            onClick={() => navigate(`/books/${book.bookId}`)}
                            sx={{
                                cursor: "pointer",
                                height: "100%",
                                borderRadius: 3,
                                border: "1px solid #e5e7eb",
                                transition: "all 0.2s ease",
                                boxShadow: "0 10px 26px rgba(15, 23, 42, 0.08)",
                                '&:hover': {
                                    boxShadow: "0 16px 35px rgba(25, 118, 210, 0.18)",
                                    transform: "translateY(-3px)",
                                    borderColor: "#90caf9",
                                },
                            }}
                        >
                            {book.coverUrl ? (
                                <img
                                    src={book.coverUrl}
                                    alt="표지"
                                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        height: 200,
                                        display: "grid",
                                        placeItems: "center",
                                        background: "linear-gradient(180deg, #e3f2fd 0%, #f7fbff 100%)",
                                        color: "#1e88e5",
                                        fontWeight: 700,
                                        letterSpacing: 0.5,
                                        borderBottom: "1px solid #e5e7eb",
                                    }}
                                >
                                    No Cover
                                </Box>
                            )}
                            <CardContent sx={{ display: "grid", gap: 1 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {book.author}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip
                                        label={book.category || "카테고리 미정"}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {books.length === 0 && (
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                p: 3,
                                textAlign: "center",
                                borderRadius: 3,
                                border: "1px dashed #cbd5e1",
                                color: "text.secondary",
                                backgroundColor: "#f8fafc",
                            }}
                        >
                            아직 등록된 도서가 없습니다. 첫 번째 도서를 등록해 보세요!
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default BookListPage;
