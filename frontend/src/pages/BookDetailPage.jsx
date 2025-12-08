// src/pages/BookDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Stack, Chip, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../app/axios";

export default function BookDetailPage() {
    const { id } = useParams(); // URL 파라미터 (/books/:id)
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 1. 도서 정보 가져오기
    async function fetchBook() {
        try {
            const res = await api.get(`/books/${id}`);
            setBook(res.data.data);
        } catch (e) {
            const msg = e.response?.data?.message || "도서 정보를 불러오지 못했습니다.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBook();
    }, [id]);

    // 2. 삭제 기능 핸들러
    const handleDelete = async () => {
        // 사용자에게 확인 받기
        if (!window.confirm("정말로 이 책을 삭제하시겠습니까?")) return;

        try {
            // API 호출: DELETE /books/{id}
            await api.delete(`/books/${id}`);
            alert("삭제되었습니다.");
            navigate("/books"); // 삭제 후 목록으로 이동
        } catch (e) {
            console.error(e);
            alert("삭제에 실패했습니다.");
        }
    };

    // 3. 수정 페이지 이동 핸들러
    const handleEdit = () => {
        // 수정 페이지로 이동 (라우터 설정이 되어 있어야 함)
        navigate(`/books/edit/${id}`);
    };

    if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
    if (!book) return <div style={{ padding: 20 }}>책을 찾을 수 없습니다.</div>;

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 16px 38px rgba(15, 23, 42, 0.1)",
                }}
            >
                <Stack spacing={2.5}>
                    {book.coverUrl ? (
                        <img
                            src={book.coverUrl}
                            alt={book.title}
                            style={{ width: "100%", borderRadius: "12px" }}
                        />
                    ) : null}

                    <Stack spacing={1}>
                        <Chip
                            label={book.category || "카테고리 미정"}
                            color="primary"
                            variant="outlined"
                            sx={{ alignSelf: "flex-start" }}
                        />
                        <Typography variant="h4" fontWeight={800}>
                            {book.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {book.authorName}
                        </Typography>
                    </Stack>

                    <Divider />

                    <Typography variant="body1" color="text.primary" sx={{ whiteSpace: "pre-line" }}>
                        {book.description || "등록된 설명이 없습니다."}
                    </Typography>

                    {/* 버튼 영역 수정 */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/books")}
                        >
                            목록으로
                        </Button>

                        {/* 수정 버튼 (파란색 계열 권장) */}
                        <Button
                            variant="outlined"
                            color="info" // 또는 primary
                            onClick={handleEdit}
                        >
                            수정
                        </Button>

                        {/* 삭제 버튼 (빨간색 계열 권장) */}
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                        >
                            삭제
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}